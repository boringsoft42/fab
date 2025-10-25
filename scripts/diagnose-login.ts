import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseLogin() {
  const email = 'admin@admin.com';
  const password = 'admin123'; // Cambia esto por tu contraseña real

  console.log('🔍 Diagnosticando login...\n');

  // Step 1: Try to sign in
  console.log('1️⃣ Intentando login con Supabase Auth...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error('❌ Error en auth:', authError.message);
    return;
  }

  console.log('✅ Login exitoso en Supabase Auth');
  console.log('   User ID:', authData.user.id);
  console.log('');

  // Step 2: Try to fetch user from users table
  console.log('2️⃣ Buscando usuario en tabla users...');
  console.log('   Query: SELECT * FROM users WHERE user_id =', authData.user.id);
  console.log('');

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('user_id, rol, estado, asociacion_id')
    .eq('user_id', authData.user.id)
    .single();

  if (userError) {
    console.error('❌ Error al buscar en tabla users:');
    console.error('   Code:', userError.code);
    console.error('   Message:', userError.message);
    console.error('   Details:', userError.details);
    console.error('   Hint:', userError.hint);
    console.log('');

    // Try without single()
    console.log('3️⃣ Intentando sin .single()...');
    const { data: userDataArray, error: userError2 } = await supabase
      .from('users')
      .select('user_id, rol, estado, asociacion_id')
      .eq('user_id', authData.user.id);

    if (userError2) {
      console.error('❌ Error también sin .single():', userError2);
      return;
    }

    console.log('   Resultados:', userDataArray);
    console.log('   Total encontrados:', userDataArray?.length || 0);

    if (userDataArray && userDataArray.length === 0) {
      console.log('\n❌ EL USUARIO NO EXISTE EN LA TABLA USERS');
      console.log('   Necesitas ejecutar el script fix-admin-fab.ts');
    }

    return;
  }

  console.log('✅ Usuario encontrado en tabla users:');
  console.log('   User ID:', userData.user_id);
  console.log('   Rol:', userData.rol);
  console.log('   Estado:', userData.estado);
  console.log('   Asociacion ID:', userData.asociacion_id);
  console.log('');

  // Check RLS policies
  console.log('4️⃣ Verificando políticas RLS...');
  const { data: testData, error: testError } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (testError) {
    console.error('❌ Posible problema con RLS:', testError);
  } else {
    console.log('✅ Acceso a tabla users OK (RLS funciona)');
  }

  console.log('\n=====================================');
  if (userData.rol === 'admin_fab' && userData.estado === 'activo') {
    console.log('🎉 ¡TODO ESTÁ CORRECTO!');
    console.log('   El login debería funcionar.');
  } else {
    console.log('⚠️  Usuario encontrado pero:');
    console.log('   Rol:', userData.rol, userData.rol === 'admin_fab' ? '✅' : '❌');
    console.log('   Estado:', userData.estado, userData.estado === 'activo' ? '✅' : '❌');
  }
  console.log('=====================================');
}

diagnoseLogin().catch(console.error);
