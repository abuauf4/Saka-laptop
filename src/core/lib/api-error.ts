// ─── Nauka Core — API Error Handling Helpers ───
// Standardized error responses for module-based route blocking.

import { NextResponse } from "next/server";

/**
 * Handle common API errors: Unauthorized, Module Inactive, and generic errors.
 * Returns a NextResponse with the appropriate status code.
 */
export function handleApiError(error: unknown, logPrefix: string = "API error"): NextResponse {
  const msg = error instanceof Error ? error.message : "Internal server error";
  const code = (error as { code?: string }).code;

  if (msg === "Unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (code === "MODULE_INACTIVE") {
    return NextResponse.json(
      { error: msg, code: "MODULE_INACTIVE" },
      { status: 403 }
    );
  }

  if (code === "MODULE_NOT_INSTALLED") {
    return NextResponse.json(
      { error: msg, code: "MODULE_NOT_INSTALLED" },
      { status: 403 }
    );
  }

  if (code === "FORBIDDEN_PERMISSION") {
    return NextResponse.json(
      { error: msg, code: "FORBIDDEN_PERMISSION" },
      { status: 403 }
    );
  }

  console.error(`${logPrefix}:`, error);
  return NextResponse.json({ error: msg }, { status: 500 });
}
