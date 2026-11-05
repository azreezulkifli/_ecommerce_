const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const p = new PrismaClient();
p.user.findUnique({ where: { email: process.argv[2] || "admin@kidsmart.com.my" } }).then((u) => {
  for (const secret of ["tukar-kunci-rahsia-anda", '"tukar-kunci-rahsia-anda"']) {
    const sig = crypto.createHmac("sha256", secret).update(u.id).digest("hex");
    console.log(secret + " => " + u.id + "." + sig);
  }
  return p.$disconnect();
});
