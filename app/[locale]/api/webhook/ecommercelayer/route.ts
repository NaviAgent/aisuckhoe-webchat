import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Membership, TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "@prisma/client"; // Import Enums
import { sumAmountByCategoryUpdateCache } from "@/lib/prisma/transaction.service";
import prisma from "@/lib/prisma/client";

// --- Configuration ---
// TODO: Replace this placeholder map with actual package details,
// potentially fetched from a database or configuration.
const packageDetailsMap: Record<
  string,
  Omit<Membership, "id" | "ownerId" | "startAt" | "endedAt"> & {
    name: string;
  } // Add a name for clarity
> = {
  basic_monthly: {
    name: "Basic Monthly",
    profileLimit: 5,
    dailyMessageLimit: 100,
    monthlyMessageLimit: 2000,
    aiVersion: ["gpt-3.5-turbo"], // Example AI version
    storageLimit: 1024, // Example value in MB
    interval: 30, // Duration in days
  },
  pro_yearly: {
    name: "Pro Yearly",
    profileLimit: 20,
    dailyMessageLimit: 500,
    monthlyMessageLimit: 10000,
    aiVersion: ["gpt-4", "gpt-3.5-turbo"], // Example AI versions
    storageLimit: 5120, // Example value in MB
    interval: 365, // Duration in days
  },
  // Add other package keys and their corresponding details here
};

// Define the expected structure of the incoming webhook payload
interface EcommercelayerWebhookPayload {
  event: string; // e.g., 'payment.succeeded'
  data: {
    customer_email: string;
    package_key: string; // Assuming these are the field names from ecommercelayer
    payment_id?: string; // TODO: Confirm actual payment ID field name from webhook
    // Include other relevant fields from the webhook payload if needed
  };
  // Add signature or other verification fields if provided by ecommercelayer
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Implement webhook signature verification for security
    // const signature = req.headers.get('ecommercelayer-signature');
    // const secret = process.env.ECOMMERCELAYER_WEBHOOK_SECRET;
    // if (!verifySignature(req.body, signature, secret)) {
    //   console.warn("Webhook: Invalid signature received.");
    //   return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    // }

    const body = (await req.json()) as EcommercelayerWebhookPayload;

    // --- Basic Validation ---
    // Check if it's the event type we care about (e.g., payment success)
    if (body.event !== "payment.succeeded") {
      // Acknowledge receipt but don't process further for irrelevant events
      console.log(`Webhook: Received non-payment success event: ${body.event}`);
      return NextResponse.json({ received: true, processed: false });
    }

    const { customer_email: email, package_key: packageKey } = body.data;

    if (!email || !packageKey) {
      console.warn("Webhook: Missing email or packageKey in payload data.");
      return NextResponse.json(
        { message: "Missing email or packageKey" },
        { status: 400 }
      );
    }

    // --- Find Clerk User ---
    console.log(`Webhook: Processing payment success for email: ${email}`);
    // Attempting to await clerkClient based on previous TS error hint
    const client = await clerkClient();
    const userList = await client.users.getUserList({
      emailAddress: [email],
    });

    // Access the data array within the paginated response
    if (userList.data.length === 0) {
      // If user not found, maybe log and return success to stop retries,
      // or return an error depending on desired behavior.
      console.warn(`Webhook: Clerk user not found for email: ${email}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Access the data array within the paginated response
    if (userList.data.length > 1) {
      // This indicates a potential issue with duplicate emails if Clerk enforces uniqueness.
      console.error(
        `Webhook: Multiple Clerk users found for email: ${email}. Aborting.`
      );
      return NextResponse.json(
        { message: "Multiple users found for email" },
        { status: 400 }
      );
    }

    // Access the first user in the data array, assert non-null as length is checked
    const clerkUserId = userList.data[0]!.id;
    console.log(`Webhook: Found Clerk user ID: ${clerkUserId}`);

    // --- Get Package Details ---
    const packageDetails = packageDetailsMap[packageKey];
    if (!packageDetails) {
      console.warn(
        `Webhook: Invalid or unknown packageKey received: ${packageKey} for user ${clerkUserId}`
      );
      return NextResponse.json(
        { message: "Invalid package key" },
        { status: 400 }
      );
    }
    console.log(
      `Webhook: Applying package "${packageDetails.name}" for user ${clerkUserId}`
    );

    // --- Calculate Membership Dates ---
    const now = new Date();
    const startAt = now;
    const endedAt = new Date(now.getTime());
    endedAt.setDate(endedAt.getDate() + packageDetails.interval);

    // --- Create Membership ---
    // TODO: Consider idempotency. Check if a membership for this specific
    // transaction/payment already exists before creating a new one.
    // This might require adding a unique transaction ID from the webhook payload
    // to the Membership model or a related Transaction model.

    // TODO: Handle existing memberships. Should this extend, replace, or ignore?
    // Current implementation simply adds a new membership record.
    const newMembership = await prisma.membership.create({
      data: {
        ownerId: clerkUserId,
        profileLimit: packageDetails.profileLimit,
        dailyMessageLimit: packageDetails.dailyMessageLimit,
        monthlyMessageLimit: packageDetails.monthlyMessageLimit,
        aiVersion: packageDetails.aiVersion,
        storageLimit: packageDetails.storageLimit,
        interval: packageDetails.interval,
        startAt: startAt,
        endedAt: endedAt,
        // Consider adding packageKey or transactionId here if needed for tracking
      },
    });

    console.log(
      `Webhook: Successfully created membership ${newMembership.id} for user ${clerkUserId}`
    );

    // // --- Update Clerk User Metadata ---
    // try {
    //   console.log(`Webhook: Updating Clerk metadata for user ${clerkUserId}`);
    //   // Use the client object obtained earlier
    //   await client.users.updateUserMetadata(clerkUserId, {
    //     privateMetadata: {
    //       // Merge with existing private metadata if necessary
    //       // ...(userList.data[0]!.privateMetadata || {}), // Requires fetching user again or adjusting initial fetch
    //       membership: newMembership,
    //     },
    //     // publicMetadata: { ... } // Update public metadata if needed
    //   });
    //   console.log(
    //     `Webhook: Successfully updated Clerk metadata for user ${clerkUserId}`
    //   );
    // } catch (clerkError) {
    //   // Log the error but potentially still return success for the webhook
    //   // as the core membership creation succeeded. Depends on requirements.
    //   console.error(
    //     `Webhook: Failed to update Clerk metadata for user ${clerkUserId}:`,
    //     clerkError
    //   );
    //   // Optionally, you could add specific error handling or retry logic here.
    // }

    // --- Create Transactions ---
    const paymentId = body.data.payment_id ?? `membership_${newMembership.id}`; // Use payment_id or fallback
    const transactionsToCreate = [
      {
        ownerId: clerkUserId,
        amount: packageDetails.monthlyMessageLimit, // Use monthly limit for MESSAGE
        sign: 1, // Positive sign for ADD
        type: TRANSACTION_TYPE.ADD,
        cat: TRANSACTION_CATEGORY.MESSAGE,
        paymentId: paymentId,
        uniqueId: `${clerkUserId}_${paymentId}_${TRANSACTION_CATEGORY.MESSAGE}_${TRANSACTION_TYPE.ADD}`,
      },
      {
        ownerId: clerkUserId,
        amount: 10000, // TODO: Determine correct value for TOKEN
        sign: 1,
        type: TRANSACTION_TYPE.ADD,
        cat: TRANSACTION_CATEGORY.TOKEN,
        paymentId: paymentId,
        uniqueId: `${clerkUserId}_${paymentId}_${TRANSACTION_CATEGORY.TOKEN}_${TRANSACTION_TYPE.ADD}`,
      },
      {
        ownerId: clerkUserId,
        amount: packageDetails.storageLimit, // Use storage limit for STORAGE
        sign: 1,
        type: TRANSACTION_TYPE.ADD,
        cat: TRANSACTION_CATEGORY.STORAGE,
        paymentId: paymentId,
        uniqueId: `${clerkUserId}_${paymentId}_${TRANSACTION_CATEGORY.STORAGE}_${TRANSACTION_TYPE.ADD}`,
      },
    ];

    try {
      console.log(`Webhook: Creating transactions for user ${clerkUserId}, payment ${paymentId}`);
      // Use createMany for potentially better performance, though it doesn't return created records by default
      // Ensure your DB supports createMany (most modern versions do)
      const transactionResult = await prisma.transaction.createMany({
        data: transactionsToCreate,
        skipDuplicates: true, // Important for idempotency if webhook retries
      });
      console.log(`Webhook: Successfully created ${transactionResult.count} transactions for user ${clerkUserId}`);
      sumAmountByCategoryUpdateCache(TRANSACTION_CATEGORY.MESSAGE)
      sumAmountByCategoryUpdateCache(TRANSACTION_CATEGORY.TOKEN)
      sumAmountByCategoryUpdateCache(TRANSACTION_CATEGORY.STORAGE)
    } catch (transactionError) {
      // Log the error but still return success for the webhook
      // as the core membership creation and metadata update succeeded.
      console.error(
        `Webhook: Failed to create transactions for user ${clerkUserId}, payment ${paymentId}:`,
        transactionError,
      );
    }

    // --- Return Success Response ---
    // Acknowledge successful processing to the webhook source
    return NextResponse.json({
      success: true,
      message: "Membership created successfully",
      membershipId: newMembership.id,
    });
  } catch (error) {
    console.error("Webhook Processing Error:", error);

    // Log specific error details if available
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Return a generic error response to the webhook source
    return NextResponse.json(
      { message: "Webhook processing failed", error: errorMessage },
      { status: 500 }
    );
  }
}
