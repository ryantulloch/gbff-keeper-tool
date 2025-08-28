---
description: "Load and apply NextRequest standards for all App Router route handlers"
---

# NextRequest Route Handler Standards

Load and internalize the mandatory NextRequest standards for all Next.js App Router route handlers in the Ratio project.

## Command Implementation

When this command is invoked, you should:

1. **Core Rule**: Always use `NextRequest` type for App Router route handlers, NEVER use `Request`

2. **Standard Import Pattern**:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   ```

3. **Correct Route Handler Signatures**:
   ```typescript
   // ✅ CORRECT - Always use NextRequest
   export async function GET(request: NextRequest) {
     // ... handler logic
   }

   export async function POST(request: NextRequest) {
     // ... handler logic
   }

   export async function PATCH(
     request: NextRequest,
     context: { params: Promise<{ id: string }> }
   ) {
     // ... handler logic
   }

   // ❌ INCORRECT - Do not use Request type
   export async function GET(request: Request) {
     // ... handler logic
   }
   ```

4. **Technical Rationale**:
   - Next.js ALWAYS passes `NextRequest` instances in App Router
   - `NextRequest` extends `Request` so all standard Web API methods work
   - Provides consistency and eliminates type confusion
   - Better TypeScript IntelliSense and error detection

5. **Next.js 15 Dynamic Routes**:
   ```typescript
   // Params is now a Promise that must be awaited
   export async function GET(
     request: NextRequest,
     context: { params: Promise<{ id: string }> }
   ) {
     const { id } = await context.params;
     // ... rest of handler
   }
   ```

6. **Thin Route Pattern** (use with NextRequest):
   ```typescript
   export async function POST(request: NextRequest) {
     // 1. Authentication
     const { userId } = await auth();
     if (!userId) return unauthorized();

     // 2. Parse and validate
     const body = await request.json();
     const data = CreateSchema.parse(body);

     try {
       // 3. Delegate to service
       const result = await domainService.create(userId, data);
       
       // 4. Return response
       return NextResponse.json(result, { status: 201 });
     } catch (err) {
       // 5. Map errors to HTTP
       return mapErrorToResponse(err);
     }
   }
   ```

## Key Benefits

1. **Technical Accuracy**: Matches what Next.js actually provides
2. **Consistency**: Eliminates confusion about which type to use
3. **Future Compatibility**: Ready for Next.js enhancements
4. **Developer Experience**: Better tooling and fewer type errors

## Compliance Checklist

When creating or reviewing route handlers:
- [ ] Import includes `NextRequest` from 'next/server'
- [ ] All route functions use `NextRequest` parameter type
- [ ] No usage of bare `Request` type in App Router handlers
- [ ] Next.js 15 Promise-based params handled correctly: `await context.params`
- [ ] Follows thin route pattern: auth → parse → delegate → respond

## Usage

User can invoke this by typing: `/nextjs-route-standards`

## Purpose

Ensures all App Router route handlers follow the mandatory NextRequest standard, eliminating type confusion and providing consistent, accurate route handler implementations across the Ratio Legal Document Automation project.