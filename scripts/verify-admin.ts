import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAdmin() {
  const { data, error } = await supabase
    .from('users')
    .select('user_id, email, rol, estado, nombre, apellido, fecha_registro')
    .eq('user_id', 'aff3cf06-7964-45c0-8175-c7ed9e86ecbc')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n✅ Usuario Admin FAB verificado:');
  console.log('=====================================');
  console.log('User ID:', data.user_id);
  console.log('Email:', data.email);
  console.log('Rol:', data.rol);
  console.log('Estado:', data.estado);
  console.log('Nombre:', data.nombre || 'No definido');
  console.log('Apellido:', data.apellido || 'No definido');
  console.log('Fecha registro:', data.fecha_registro);
  console.log('=====================================\n');

  if (data.rol === 'admin_fab' && data.estado === 'activo') {
    console.log('✅ TODO CORRECTO! Puedes hacer login ahora.');
    console.log('📍 Serás redirigido a: /dashboard/admin-fab\n');
  } else {
    console.log('❌ Hay un problema con el rol o estado');
    console.log(`   Rol actual: ${data.rol} (debe ser: admin_fab)`);
    console.log(`   Estado actual: ${data.estado} (debe ser: activo)`);
  }
}

verifyAdmin();
