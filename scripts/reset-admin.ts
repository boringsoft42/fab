import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    console.log('🔄 Resetting admin_fab user...\n');

    const email = 'admin@fab.bo';
    const password = 'Admin123!';

    // Delete existing users with this email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    if (existingUser) {
      console.log('🗑️  Deleting existing auth user:', existingUser.id);
      await supabase.auth.admin.deleteUser(existingUser.id);
      await prisma.users.deleteMany({ where: { user_id: existingUser.id } });
    }

    // Get La Paz asociación
    let laPaz = await prisma.asociaciones.findFirst({
      where: { nombre: 'La Paz' },
    });

    if (!laPaz) {
      console.log('Creating La Paz asociación...');
      laPaz = await prisma.asociaciones.create({
        data: {
          nombre: 'La Paz',
          departamento: 'La Paz',
          ciudad: 'La Paz',
        },
      });
    }

    // Create new auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('❌ Error creating auth user:', authError);
      process.exit(1);
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Create user record
    const user = await prisma.users.create({
      data: {
        user_id: authData.user.id,
        rol: 'admin_fab',
        estado: 'activo',
        asociacion_id: laPaz.id,
      },
    });

    console.log('✅ User record created\n');
    console.log('='.repeat(60));
    console.log('✅ SUCCESS! New admin_fab user created');
    console.log('='.repeat(60));
    console.log('\n📧 Login credentials:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    console.log('  Rol:', user.rol);
    console.log('  Estado:', user.estado);
    console.log('\n🎉 You can now login at http://localhost:3000/sign-in\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();
