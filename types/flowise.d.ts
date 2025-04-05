// types/flowise.d.ts

declare namespace Flowise {

  // Common Types
  interface BaseEntity {
    id: string;
    createdDate: string; // ISO Date String
    updatedDate: string; // ISO Date String
  }

  interface FileMetadata {
    filename: string;
    mimeType: string;
    size: number; // in bytes
    url?: string; // URL if stored externally
  }

  interface Metadata {
    [key: string]: any;
  }

  // Assistants API
  // https://docs.flowiseai.com/api-reference/assistants
  interface AssistantTool {
    type: 'function' | 'code_interpreter' | 'retrieval'; // Add other types if available
    function?: {
      name: string;
      description?: string;
      parameters: object; // JSON Schema
    };
  }

  interface Assistant extends BaseEntity {
    name: string;
    description?: string;
    instructions?: string;
    tools?: AssistantTool[];
    model: string; // e.g., "gpt-4"
    file_ids?: string[];
    metadata?: Metadata;
  }

  interface CreateAssistantRequest {
    name: string;
    description?: string;
    instructions?: string;
    tools?: AssistantTool[];
    model: string;
    file_ids?: string[];
    metadata?: Metadata;
  }

  interface UpdateAssistantRequest {
    name?: string;
    description?: string;
    instructions?: string;
    tools?: AssistantTool[];
    model?: string;
    file_ids?: string[];
    metadata?: Metadata;
  }

  interface ListAssistantsResponse {
    data: Assistant[];
    // Add pagination fields if available in the API response
  }

  // Attachments API
  // https://docs.flowiseai.com/api-reference/attachments
  interface Attachment extends BaseEntity, FileMetadata {
    purpose: 'fine-tune' | 'assistants'; // Add other purposes if available
    bytes: number; // Alias for size
    status: string; // e.g., "uploaded", "processed"
  }

  // UploadAttachment typically uses FormData, interface might not be strictly needed for request body
  // but the response is an Attachment object.

  // Chat Message API
  // https://docs.flowiseai.com/api-reference/chat-message
  interface ChatMessage extends BaseEntity {
    chatflowid: string; // ID of the chatflow
    role: 'user' | 'api' | 'assistant' | 'system'; // Extend as needed
    content: string;
    sourceDocuments?: any[]; // Structure depends on the specific use case
    usedTools?: any[]; // Structure depends on the specific use case
    fileAnnotations?: any[]; // Structure depends on the specific use case
    createdDate: string; // ISO Date String
    // Optional fields based on API response
    chatId?: string;
    memoryType?: string;
    questionId?: string;
    feedback?: any; // Define Feedback interface if needed
    lead?: any; // Define Lead interface if needed
  }

  interface ListChatMessagesParams {
    chatflowid: string;
    sortOrder?: 'ASC' | 'DESC';
    startDate?: string; // ISO Date String
    endDate?: string; // ISO Date String
    messageId?: string; // To fetch specific message
    memoryType?: string; // e.g., "buffer", "database"
    sessionId?: string;
    chatId?: string; // Alias for sessionId
  }

  interface ListChatMessagesResponse {
    data: ChatMessage[];
    // Add pagination fields if available
    total?: number;
    limit?: number;
    offset?: number;
  }

  // Vector Upsert API
  // https://docs.flowiseai.com/api-reference/vector-upsert
  interface UpsertVectorBaseRequest {
    chatflowid: string; // ID of the chatflow
    metadata?: Metadata;
  }

  interface UpsertVectorDocumentRequest extends UpsertVectorBaseRequest {
    documentId: string; // ID of the document in the Document Store
  }

  interface UpsertVectorFileRequest extends UpsertVectorBaseRequest {
    // Typically uses FormData, interface might not be strictly needed for request body
    // Requires 'files' field in FormData
  }

  interface UpsertVectorTextRequest extends UpsertVectorBaseRequest {
    text: string;
  }

  interface UpsertVectorResponse {
    message: string;
    // Add other fields if the API returns more details
    numAdded?: number;
    numUpdated?: number;
    numSkipped?: number;
    numDeleted?: number;
  }

  // Chatflows API
  // https://docs.flowiseai.com/api-reference/chatflows
  interface Chatflow extends BaseEntity {
    name: string;
    flowData: string; // JSON string representing the chatflow structure
    deployed?: boolean;
    isPublic?: boolean;
    apikeyid?: string;
    chatbotConfig?: any; // Define specific config structure if known
    category?: string;
    updatedDate: string; // ISO Date String
    createdDate: string; // ISO Date String
  }

  interface ListChatflowsResponse {
    data: Chatflow[];
    // Add pagination fields if available
  }

  // Document Store API
  // https://docs.flowiseai.com/api-reference/document-store
  interface DocumentStoreFile extends BaseEntity, FileMetadata {
    chatflowid: string; // ID of the chatflow it belongs to
    status: 'processing' | 'indexed' | 'failed' | 'pending';
    loader?: string; // e.g., 'pdfLoader', 'textLoader'
    splitter?: string; // e.g., 'recursiveCharacterTextSplitter'
    chunks?: number; // Number of chunks created
    error?: string; // Error message if status is 'failed'
  }

  interface ListDocumentStoresParams {
    chatflowid: string;
    sortOrder?: 'ASC' | 'DESC';
    startDate?: string; // ISO Date String
    endDate?: string; // ISO Date String
  }

  interface ListDocumentStoresResponse {
    data: DocumentStoreFile[];
    // Add pagination fields if available
    total?: number;
    limit?: number;
    offset?: number;
  }

  // Feedback API
  // https://docs.flowiseai.com/api-reference/feedback
  interface Feedback extends BaseEntity {
    chatflowid: string;
    chatId: string; // ID of the chat session
    messageId: string; // ID of the specific message
    rating: 'THUMBS_UP' | 'THUMBS_DOWN';
    content?: string; // Optional textual feedback
  }

  interface CreateFeedbackRequest {
    chatflowid: string;
    chatId: string;
    messageId: string;
    rating: 'THUMBS_UP' | 'THUMBS_DOWN';
    content?: string;
  }

  interface ListFeedbackParams {
    chatflowid: string;
    sortOrder?: 'ASC' | 'DESC';
    startDate?: string; // ISO Date String
    endDate?: string; // ISO Date String
    rating?: 'THUMBS_UP' | 'THUMBS_DOWN';
    chatId?: string;
    messageId?: string;
  }

  interface ListFeedbackResponse {
    data: Feedback[];
    // Add pagination fields if available
    total?: number;
    limit?: number;
    offset?: number;
  }

  // Leads API
  // https://docs.flowiseai.com/api-reference/leads
  interface Lead extends BaseEntity {
    chatflowid: string;
    chatId: string; // ID of the chat session
    createdDate: string; // ISO Date String
    // Fields captured by the lead capture node (dynamic)
    [key: string]: any;
  }

  interface CreateLeadRequest {
    chatflowid: string;
    chatId: string;
    // Captured data fields
    [key: string]: any;
  }

  interface ListLeadsParams {
    chatflowid: string;
    sortOrder?: 'ASC' | 'DESC';
    startDate?: string; // ISO Date String
    endDate?: string; // ISO Date String
    chatId?: string;
  }

  interface ListLeadsResponse {
    data: Lead[];
    // Add pagination fields if available
    total?: number;
    limit?: number;
    offset?: number;
  }

  // Ping API
  // https://docs.flowiseai.com/api-reference/ping
  interface PingResponse {
    status: string; // e.g., "OK"
    message: string; // e.g., "pong"
    version?: string; // Flowise version
  }

  // Prediction API (Chatflow Interaction)
  // https://docs.flowiseai.com/api-reference/prediction
  interface PredictionRequest {
    question: string;
    overrideConfig?: {
      // Specific overrides for the chatflow execution
      // Example: modelName, temperature, maxTokens, etc.
      [key: string]: any;
    };
    history?: ChatMessage[]; // Previous messages for context
    socketIOClientId?: string; // For streaming responses via Socket.IO
    chatId?: string; // To maintain session state
    memoryType?: string; // e.g., "buffer", "database"
    sessionId?: string; // Alias for chatId
  }

  interface PredictionResponse {
    text?: string; // The main response text
    chatId?: string; // Session ID
    sessionId?: string; // Alias for chatId
    memoryType?: string;
    sourceDocuments?: any[]; // Relevant source documents if retrieval was used
    usedTools?: any[]; // Tools used during generation
    fileAnnotations?: any[]; // Annotations related to files
    // Other potential fields based on chatflow execution
    [key: string]: any;
  }

  // For streaming responses, the structure might differ per chunk
  interface PredictionStreamChunk {
    type: 'start' | 'stream' | 'end' | 'sourceDocuments' | 'usedTools' | 'fileAnnotations' | 'message' | 'error';
    data?: any; // Content depends on the type
    // Example for 'stream' type: { text: "partial response" }
    // Example for 'sourceDocuments': Array of documents
  }

  // Tools API
  // https://docs.flowiseai.com/api-reference/tools
  interface Tool extends BaseEntity {
    name: string;
    description: string;
    color: string; // Hex color code
    iconSrc?: string; // URL or path to the icon
    schema: string; // JSON string representing the tool's schema/config
    func?: string; // JavaScript code for the tool's function (if applicable)
    createdDate: string; // ISO Date String
    updatedDate: string; // ISO Date String
  }

  interface ListToolsResponse {
    data: Tool[];
    // Add pagination fields if available
  }

  // Upsert History API
  // https://docs.flowiseai.com/api-reference/upsert-history
  interface UpsertHistoryRequest {
    chatId: string; // ID of the chat session
    chatflowid: string; // ID of the chatflow
    message: ChatMessage; // The message object to upsert
  }

  interface UpsertHistoryResponse {
    message: string; // e.g., "Successfully upserted chat message"
    // Add other fields if the API returns more details
  }

  // Variables API
  // https://docs.flowiseai.com/api-reference/variables
  interface Variable extends BaseEntity {
    chatflowid: string; // ID of the chatflow
    name: string; // Variable name (e.g., {{variableName}})
    value: string; // Variable value
    type: 'overrideConfig' | 'input'; // Type of variable
  }

  interface ListVariablesParams {
    chatflowid: string;
    type?: 'overrideConfig' | 'input';
  }

  interface ListVariablesResponse {
    data: Variable[];
    // Add pagination fields if available
  }

}

// Export the namespace to make it available globally or for import
export default Flowise;
