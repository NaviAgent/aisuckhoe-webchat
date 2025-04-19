"use server";

import { initCloudinary } from "@/lib/cloudinary/server";
import prisma from "@/lib/prisma/client";
import { FileAsset } from "@prisma/client";
/**
 * Creates a new FileAsset record in the database after a successful Cloudinary upload.
 * @param uploadResult - The result object from the Cloudinary upload widget.
 */
export async function createFileAsset(
  data: Omit<FileAsset, "id" | "createdAt" | "updatedAt" | "deletedAt">
): Promise<{ success: boolean; data?: FileAsset; error?: string }> {
  try {
    console.log(data);
    const newAsset = await prisma.fileAsset.create({ data });
    return { success: true, data: newAsset };
  } catch (error) {
    console.error("[createFileAsset] Error creating FileAsset:", error);
    return { success: false, error: "Failed to save file information." };
  }
}

// export async function createFileAsset(uploadResult: CloudinaryUploadResult): Promise<{ success: boolean; data?: FileAsset; error?: string }> {
//   try {
//     const newAsset = await prisma.fileAsset.create({
//       data: {
//         cloudinaryPublicId: uploadResult.public_id,
//         fileName: uploadResult.original_filename || uploadResult.public_id, // Use original name or public_id
//         format: uploadResult.format,
//         resourceType: uploadResult.resource_type,
//         sizeBytes: uploadResult.bytes,
//         width: uploadResult.width,
//         height: uploadResult.height,
//         url: uploadResult.url,
//         secureUrl: uploadResult.secure_url,
//         tags: uploadResult.tags || [],
//         ownerId: userId,
//         // Initialize optional fields if needed
//         altText: '',
//         caption: '',
//       },
//     });
//     console.log('Created FileAsset:', newAsset);

//     // Revalidate relevant paths if needed (e.g., the page displaying the library)
//     // revalidatePath('/path-to-library');

//     return { success: true, data: newAsset };
//   } catch (error) {
//     console.error('Error creating FileAsset:', error);
//     return { success: false, error: 'Failed to save file information.' };
//   }
// }

/**
 * Fetches all FileAssets for the currently authenticated user.
 */
export async function getFileAssets(
  ownerId: string
): Promise<{ success: boolean; data?: FileAsset[]; error?: string }> {
  try {
    const assets = await prisma.fileAsset.findMany({
      where: {
        ownerId,
        deletedAt: null, // Only fetch non-deleted assets
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: assets };
  } catch (error) {
    console.error("[getFileAssets] Error fetching FileAssets:", error);
    return { success: false, error: "Failed to fetch file assets." };
  }
}
// export async function getFileAssets(): Promise<FileAsset[]> {
//   try {
//     const assets = await prisma.fileAsset.findMany({
//       where: {
//         ownerId: userId,
//         deletedAt: null, // Only fetch non-deleted assets
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//     return assets;
//   } catch (error) {
//     console.error('Error fetching FileAssets:', error);
//     return []; // Return empty array on error
//   }
// }

/**
 * Fetches a single FileAsset by its database ID.
 * Ensures the asset belongs to the authenticated user.
 * @param id - The database ID of the FileAsset.
 */
export async function getFileAssetById(
  id: string,
  ownerId: string
): Promise<{ success: boolean; data?: FileAsset | null; error?: string }> {
  try {
    const asset = await prisma.fileAsset.findUnique({
      where: {
        id: id,
        ownerId,
        deletedAt: null,
      },
    });
    return { success: true, data: asset };
  } catch (error) {
    console.error(
      `[getFileAssetById] Error fetching FileAsset with ID ${id}:`,
      error
    );
    return { success: true, error: "Failed to fetch file asset." };
  }
}
// export async function getFileAssetById(id: string): Promise<FileAsset | null> {
//   try {
//     const asset = await prisma.fileAsset.findUnique({
//       where: {
//         id: id,
//         ownerId: userId, // Ensure user owns the asset
//         deletedAt: null,
//       },
//     });
//     return asset;
//   } catch (error) {
//     console.error(`Error fetching FileAsset with ID ${id}:`, error);
//     return null;
//   }
// }

/**
 * Updates the metadata (altText, caption, tags) of a FileAsset.
 * Ensures the asset belongs to the authenticated user.
 * @param id - The database ID of the FileAsset.
 * @param metadata - An object containing the metadata fields to update.
 */
export async function updateFileAssetMetadata(
  id: string,
  ownerId: string,
  metadata: { altText?: string; caption?: string; tags?: string[] }
): Promise<{ success: boolean; data?: FileAsset; error?: string }> {
  try {
    // First, verify the user owns the asset
    const existingAsset = await prisma.fileAsset.findUnique({
      where: { id: id, ownerId, deletedAt: null },
      select: { id: true }, // Only select necessary field
    });

    if (!existingAsset) {
      throw new Error("FileAsset not found or user does not have permission.");
    }

    const updatedAsset = await prisma.fileAsset.update({
      where: {
        id: id,
        // No need for ownerId check here again as we verified above
      },
      data: {
        altText: metadata.altText,
        caption: metadata.caption,
        tags: metadata.tags,
      },
    });

    // Revalidate relevant paths if needed
    // revalidatePath(`/path-displaying-asset/${id}`);

    return { success: true, data: updatedAsset };
  } catch (error) {
    console.error(
      `[updateFileAssetMetadata] Error updating metadata for FileAsset ${id}:`,
      error
    );
    return { success: false, error: "Failed to update file metadata." };
  }
}
// export async function updateFileAssetMetadata(
//   id: string,
//   metadata: { altText?: string; caption?: string; tags?: string[] }
// ): Promise<{ success: boolean; data?: FileAsset; error?: string }> {
//   try {
//     // First, verify the user owns the asset
//     const existingAsset = await prisma.fileAsset.findUnique({
//       where: { id: id, ownerId: userId, deletedAt: null },
//       select: { id: true }, // Only select necessary field
//     });

//     if (!existingAsset) {
//       throw new Error('FileAsset not found or user does not have permission.');
//     }

//     const updatedAsset = await prisma.fileAsset.update({
//       where: {
//         id: id,
//         // No need for ownerId check here again as we verified above
//       },
//       data: {
//         altText: metadata.altText,
//         caption: metadata.caption,
//         tags: metadata.tags,
//       },
//     });

//     // Revalidate relevant paths if needed
//     // revalidatePath(`/path-displaying-asset/${id}`);

//     return { success: true, data: updatedAsset };
//   } catch (error) {
//     console.error(`Error updating metadata for FileAsset ${id}:`, error);
//     return { success: false, error: 'Failed to update file metadata.' };
//   }
// }

/**
 * Deletes a FileAsset from the database and Cloudinary.
 * Ensures the asset belongs to the authenticated user.
 * @param id - The database ID of the FileAsset.
 */

export async function deleteFileAsset(
  id: string,
  ownerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find the asset to get its Cloudinary public ID and verify ownership
    const assetToDelete = await prisma.fileAsset.findUnique({
      where: {
        id: id,
        ownerId,
        deletedAt: null, // Ensure it's not already marked as deleted
      },
    });

    if (!assetToDelete) {
      console.error(
        `[deleteFileAsset] FileAsset ${id} not found or user does not have permission.`
      );
      return {
        success: false,
        error: "FileAsset not found or user does not have permission.",
      };
    }

    const cloudinary = await initCloudinary();

    // 1. Delete from Cloudinary
    // Use destroy method, need the public_id and resource_type
    await cloudinary.uploader.destroy(assetToDelete.cloudinaryPublicId, {
      // Access uploader via v2
      resource_type: assetToDelete.resourceType,
    });
    console.log(
      `[deleteFileAsset] Deleted asset ${assetToDelete.cloudinaryPublicId} from Cloudinary.`
    );

    // 2. Delete from Database (soft or hard delete)
    // Option A: Soft delete (mark as deleted)
    await prisma.fileAsset.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });
    console.log(
      `[deleteFileAsset] Soft deleted FileAsset ${id} from database.`
    );

    // Option B: Hard delete (remove record permanently) - Uncomment if preferred
    // await prisma.fileAsset.delete({
    //   where: { id: id },
    // });
    // console.log(`Hard deleted FileAsset ${id} from database.`);

    // Revalidate relevant paths
    // revalidatePath('/path-to-library');
    // revalidatePath(`/path-displaying-asset/${id}`); // If applicable

    return { success: true };
  } catch (error) {
    console.error(`[deleteFileAsset] Error deleting FileAsset ${id}:`, error);
    // Consider more specific error handling (e.g., Cloudinary deletion failed but DB succeeded?)
    return { success: false, error: "Failed to delete file." };
  }
}
// export async function deleteFileAsset(id: string): Promise<{ success: boolean; error?: string }> {
//   try {
//     // Find the asset to get its Cloudinary public ID and verify ownership
//     const assetToDelete = await prisma.fileAsset.findUnique({
//       where: {
//         id: id,
//         ownerId: userId,
//         deletedAt: null, // Ensure it's not already marked as deleted
//       },
//     });

//     if (!assetToDelete) {
//       throw new Error('FileAsset not found or user does not have permission.');
//     }

//     // 1. Delete from Cloudinary
//     // Use destroy method, need the public_id and resource_type
//     await cloudinary.v2.uploader.destroy(assetToDelete.cloudinaryPublicId, { // Access uploader via v2
//       resource_type: assetToDelete.resourceType,
//     });
//     console.log(`Deleted asset ${assetToDelete.cloudinaryPublicId} from Cloudinary.`);

//     // 2. Delete from Database (soft or hard delete)
//     // Option A: Soft delete (mark as deleted)
//     await prisma.fileAsset.update({
//       where: { id: id },
//       data: { deletedAt: new Date() },
//     });
//     console.log(`Soft deleted FileAsset ${id} from database.`);

//     // Option B: Hard delete (remove record permanently) - Uncomment if preferred
//     // await prisma.fileAsset.delete({
//     //   where: { id: id },
//     // });
//     // console.log(`Hard deleted FileAsset ${id} from database.`);

//     // Revalidate relevant paths
//     // revalidatePath('/path-to-library');
//     // revalidatePath(`/path-displaying-asset/${id}`); // If applicable

//     return { success: true };
//   } catch (error) {
//     console.error(`Error deleting FileAsset ${id}:`, error);
//     // Consider more specific error handling (e.g., Cloudinary deletion failed but DB succeeded?)
//     return { success: false, error: 'Failed to delete file.' };
//   }
// }

export async function destroyFileAsset(
  cloudinaryPublicId: string,
  resourceType: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cloudinary = await initCloudinary();
    // 1. Delete from Cloudinary
    // Use destroy method, need the public_id and resource_type
    await cloudinary.uploader.destroy(cloudinaryPublicId, {
      // Access uploader via v2
      resource_type: resourceType,
    });

    return { success: true };
  } catch (error) {
    console.error(
      `[destroyFileAsset] Error deleting FileAsset ${cloudinaryPublicId}:`,
      error
    );
    // Consider more specific error handling (e.g., Cloudinary deletion failed but DB succeeded?)
    return { success: false, error: "Failed to destroy file." };
  }
}
