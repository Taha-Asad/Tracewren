import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const contact = req.nextUrl.searchParams.get("contact") || "tahaasad709@gmail.com";
  const securityTxt = `# RFC 9116 Security Policy for BugBountyTrack
Contact: mailto:${contact}
Contact: https://caulvyn.com/workspace
Expires: 2027-12-31T23:59:59.000Z
Encryption: https://caulvyn.com/pgp-key.asc
Acknowledgments: https://caulvyn.com/hall-of-fame
Policy: https://caulvyn.com/disclosure-policy
Preferred-Languages: en
Canonical: https://caulvyn.com/.well-known/security.txt
Hiring: https://caulvyn.com/careers
`;

  return new NextResponse(securityTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
