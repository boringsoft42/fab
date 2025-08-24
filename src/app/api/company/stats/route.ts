import { NextRequest, NextResponse } from "next/server";
import { CompanyService } from "@/services/company.service";
import { getUserFromToken } from "@/lib/api";

export async function GET() {
  try {
    console.log("📊 GET /api/company/stats - Starting request");

    // Get user info from token
    const userInfo = getUserFromToken();
    console.log("👤 User info from token:", userInfo);

    if (!userInfo) {
      console.log("❌ No user info found in token");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Check if user has permission to view company stats
    const allowedRoles = ['SUPERADMIN', 'GOBIERNOS_MUNICIPALES', 'EMPRESAS'];
    if (!allowedRoles.includes(userInfo.role || '')) {
      console.log("❌ Access denied - Role not allowed:", userInfo.role);
      return NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      );
    }

    console.log("📊 Calling CompanyService.getCompanyStats() with user info");
    const result = await CompanyService.getCompanyStats(
      userInfo.id,
      userInfo.role,
      userInfo.municipalityId
    );
    console.log("📊 CompanyService stats result:", result);

    if (result.success) {
      console.log("✅ Success - Returning stats:", result.data);
      return NextResponse.json(result.data);
    } else {
      console.log("❌ CompanyService stats failed:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("💥 Error in GET /api/company/stats:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 