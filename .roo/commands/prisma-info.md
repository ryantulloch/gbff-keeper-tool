---
description: "Complete Prisma Client reference for Ratio project - models, fields, ID types, patterns"
---

# Prisma Client Reference for Ratio

## Database Connection & Import
```typescript
import { prisma } from '@/lib/server/db';
// Standard import - use 'prisma' not 'db'
```

## Models & Field Mappings

### Profile
- **Model Name**: `Profile`
- **Table**: `profiles`
- **ID Type**: UUID (PostgreSQL generated)
- **Access**: `prisma.profile`

```typescript
// Fields (camelCase in code -> snake_case in DB)
{
  id: string;            // -> id (UUID)
  clerkUserId: string;   // -> clerk_user_id (unique — schema-enforced)
  email?: string;        // -> email
  fullName?: string;     // -> full_name
  role: string;          // -> role (default: "USER")
  preferences: Json;     // -> preferences (JSON, default: {})
  createdAt: Date;       // -> created_at
  updatedAt: Date;       // -> updated_at
}
```

### CanonicalVariable
- **Model Name**: `CanonicalVariable`
- **Table**: `canonical_variables`
- **ID Type**: CUID (high frequency)
- **Access**: `prisma.canonicalVariable`

```typescript
// Fields (camelCase in code -> snake_case in DB)
{
  id: string;            // -> id (CUID)
  documentType: string;  // -> document_type
  canonicalName: string; // -> canonical_name
  description?: string;  // -> description
  dataType?: string;     // -> data_type
  rawVariants: Json;     // -> raw_variants (JSON array)
  notes?: string;        // -> notes
  version?: number;      // -> version
  createdAt: Date;       // -> created_at
  updatedAt: Date;       // -> updated_at
}

// Unique constraint: [documentType, canonicalName]
```

### VariableDictionary
- **Model Name**: `VariableDictionary`
- **Table**: `variable_dictionaries`
- **ID Type**: CUID (high frequency)
- **Access**: `prisma.variableDictionary`

```typescript
// Fields (camelCase in code -> snake_case in DB)
{
  id: string;                    // -> id (CUID)
  name: string;                  // -> name
  documentType: string;          // -> document_type
  version: number;               // -> version (default: 1)
  status: DictionaryStatus;      // -> status (DRAFT/PENDING_REVIEW/PUBLISHED/ARCHIVED)
  variables: Json;               // -> variables (JSON)
  sourceJobIds: string[];        // -> source_job_ids (string array)
  publishedAt?: Date;            // -> published_at
  clerkUserId: string;           // -> clerk_user_id
  createdBy: string;             // -> created_by
  updatedBy: string;             // -> updated_by
  metadata: Json;                // -> metadata (JSON, default: {})
  createdAt: Date;               // -> created_at
  updatedAt: Date;               // -> updated_at
}
```

### Job
- **Model Name**: `Job`
- **Table**: `jobs`
- **ID Type**: UUID (PostgreSQL generated)
- **Access**: `prisma.job`

```typescript
// Fields (snake_case in both code and DB - legacy pattern)
{
  id: string;                    // -> id (UUID)
  clerk_user_id: string;         // -> clerk_user_id
  job_type: JobType;             // -> job_type
  status: JobStatus;             // -> status
  progress: number;              // -> progress (default: 0)
  message?: string;              // -> message
  input_file_url?: string;       // -> input_file_url
  output_file_url?: string;      // -> output_file_url
  error_message?: string;        // -> error_message
  total_duration_ms?: number;    // -> total_duration_ms
  phase_durations?: Json;        // -> phase_durations
  stage_durations?: Json;        // -> stage_durations
  started_at?: Date;             // -> started_at
  completed_at?: Date;           // -> completed_at
  created_at: Date;              // -> created_at
  updated_at: Date;              // -> updated_at
  document_type?: string;        // -> document_type
  documents_processed?: number;  // -> documents_processed
  processed_on?: Date;           // -> processed_on
  variables_extracted?: number;  // -> variables_extracted
  deleted_at?: Date;             // -> deleted_at
  output_data?: Json;            // -> output_data
}
```

### WebhookLog
- **Model Name**: `WebhookLog`
- **Table**: `webhook_logs`
- **ID Type**: CUID
- **Access**: `prisma.webhookLog`

```typescript
// Fields (camelCase in code -> snake_case in DB)
{
  id: string;           // -> id (CUID)
  svixId: string;       // -> svix_id (unique)
  eventType: string;    // -> event_type
  clerkUserId: string;  // -> clerk_user_id
  processedAt: Date;    // -> processed_at
  status: WebhookStatus;// -> status
  errorMessage?: string;// -> error_message
  createdAt: Date;      // -> created_at
}
```

### DictionaryAuditLog
- **Model Name**: `DictionaryAuditLog`
- **Table**: `dictionary_audit_logs`
- **ID Type**: CUID
- **Access**: `prisma.dictionaryAuditLog`

```typescript
// Fields (camelCase in code -> snake_case in DB)
{
  id: string;              // -> id (CUID)
  dictionaryId: string;    // -> dictionary_id
  userId: string;          // -> user_id
  operation: AuditOperation; // -> operation
  changeDetails: Json;     // -> change_details
  previousValues?: Json;   // -> previous_values
  newValues?: Json;        // -> new_values
  timestamp: Date;         // -> timestamp
  ipAddress?: string;      // -> ip_address
  userAgent?: string;      // -> user_agent
}
```

## Enums

### JobStatus
```typescript
enum JobStatus {
  QUEUED = "QUEUED",
  RUNNING = "RUNNING", 
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}
```

### JobType
```typescript
enum JobType {
  PHASE0_TEMPLATE_VARIABLES = "PHASE0_TEMPLATE_VARIABLES",
  NORMAL_METADATA_EXTRACTION = "NORMAL_METADATA_EXTRACTION",
  TEMPLATE_MODE_EXTRACTION = "TEMPLATE_MODE_EXTRACTION",
  DICTIONARY_CANONICALIZATION = "DICTIONARY_CANONICALIZATION"
}
```

### DictionaryStatus
```typescript
enum DictionaryStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED"
}
```

### AuditOperation
```typescript
enum AuditOperation {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  PUBLISH = "PUBLISH",
  ARCHIVE = "ARCHIVE",
  RESTORE = "RESTORE"
}
```

### WebhookStatus
```typescript
enum WebhookStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING"
}
```

## ID Type Standards (LIVE DATABASE VERIFIED)

### UUID (PostgreSQL Generated)
- **Models**: Profile, Job, DictionaryVersion, DocumentTypeDefault, DocumentTypeAlias
- **Database Type**: `uuid` with `gen_random_uuid()`
- **Use Case**: Core user-facing and versioned entities
- **Validation**: `z.string().uuid()`

### Text/CUID (Most Models)
- **Models**: CanonicalVariable, VariableDictionary, WebhookLog, DictionaryAuditLog, DocumentTypeGroup, VariableGlobalIndex, DictionaryMergeSuggestion
- **Database Type**: `text` (CUID or generic string)
- **Use Case**: High-frequency and denormalized entities
- **Validation**: `z.string().cuid()` or `z.string()` depending on requirements

### Reality Check
Several core tables now use native UUID IDs (Profile, Job, DictionaryVersion, DocumentTypeDefault, DocumentTypeAlias). Many others continue to use text/CUID IDs by design.

## Common Patterns

### Basic Query
```typescript
const user = await prisma.profile.findUnique({
  where: { clerkUserId: userId },
  select: { id: true, role: true }
});
```

### Transaction
```typescript
const result = await prisma.$transaction(async (tx) => {
  const created = await tx.canonicalVariable.create({ data });
  await tx.dictionaryAuditLog.create({ data: auditData });
  return created;
});
```

### RLS-Style Filtering
```typescript
const userVariables = await prisma.canonicalVariable.findMany({
  where: {
    documentType: "separation_agreement",
    // Add user scoping through related dictionary if needed
  }
});
```

### Pagination
```typescript
const [items, total] = await Promise.all([
  prisma.job.findMany({
    where: { clerk_user_id: userId },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { created_at: 'desc' }
  }),
  prisma.job.count({ where: { clerk_user_id: userId } })
]);
```

### Error Handling
```typescript
try {
  await prisma.canonicalVariable.create({ data });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    throw new ConflictError('Variable already exists');
  }
  throw e;
}
```

## Important Notes

1. **Import Pattern**: Always use `import { prisma } from '@/lib/server/db'`
2. **Model Naming**: Use camelCase model names (e.g., `canonicalVariable`, not `canonical_variables`)
3. **Field Naming**: Use camelCase in TypeScript, maps to snake_case in DB automatically
4. **Transactions**: Use for multi-step operations, properly typed
5. **Error Handling**: Map P2002 to ConflictError for unique constraint violations
6. **Performance**: Use `select` for specific fields, avoid N+1 queries
7. **Legacy**: Job model uses snake_case fields (historical reasons)

## Migration Commands
```bash
# Generate client after schema changes
npx prisma generate

# Create and apply migration  
npx prisma migrate dev --name descriptive_name

# Reset (NEVER in production)
npx prisma migrate reset  # FORBIDDEN in production

# Use Supabase MCP for production migrations instead
```

## Common Mistakes to Avoid
- ❌ `prisma.canonical_variables` (wrong model name)
- ❌ `import { db } from '@/lib/server/db'` (deprecated)
- ❌ Using snake_case field names in TypeScript
- ❌ Not handling P2002 constraint errors
- ❌ Using `prisma migrate reset` in production
- ✅ `prisma.canonicalVariable` (correct)
- ✅ `import { prisma } from '@/lib/server/db'` (standard)
- ✅ Using camelCase field names in TypeScript
- ✅ Mapping P2002 to ConflictError
- ✅ Using Supabase MCP for production migrations