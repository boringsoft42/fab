import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdminFab() {
  const adminUserId = 'aff3cf06-7964-45c0-8175-c7ed9e86ecbc';

  console.log('🔍 Verificando usuario admin_fab...\n');

  // 1. Check current user data
  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('user_id, rol, estado, asociacion_id')
    .eq('user_id', adminUserId)
    .single();

  if (userError) {
    console.error('❌ Error al obtener usuario:', userError);
    return;
  }

  console.log('📊 Datos actuales del usuario:');
  console.log('  - User ID:', currentUser.user_id);
  console.log('  - Rol:', currentUser.rol);
  console.log('  - Estado:', currentUser.estado);
  console.log('  - Asociacion ID:', currentUser.asociacion_id);
  console.log('');

  // 2. Get or create a default asociacion for admin_fab
  let asociacionId = currentUser.asociacion_id;

  if (!asociacionId) {
    console.log('⚠️  Usuario no tiene asociacion_id. Buscando asociación FAB...\n');

    // Try to find FAB association
    const { data: fabAsoc, error: asocError } = await supabase
      .from('asociaciones')
      .select('id, nombre')
      .ilike('nombre', '%fab%')
      .limit(1)
      .single();

    if (fabAsoc) {
      console.log(`✅ Encontré asociación: ${fabAsoc.nombre} (${fabAsoc.id})`);
      asociacionId = fabAsoc.id;
    } else {
      // Create a default FAB association
      console.log('📝 Creando asociación FAB...\n');
      const { data: newAsoc, error: createError } = await supabase
        .from('asociaciones')
        .insert({
          nombre: 'Federación Atlética Boliviana',
          departamento: 'La Paz',
          ciudad: 'La Paz',
          contacto: 'Administrador FAB',
          email: 'admin@fab.bo',
          estado: true,
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error al crear asociación:', createError);
        return;
      }

      console.log(`✅ Asociación creada: ${newAsoc.nombre} (${newAsoc.id})\n`);
      asociacionId = newAsoc.id;
    }

    // Update user with asociacion_id
    const { error: updateError } = await supabase
      .from('users')
      .update({ asociacion_id: asociacionId })
      .eq('user_id', adminUserId);

    if (updateError) {
      console.error('❌ Error al actualizar usuario:', updateError);
      return;
    }

    console.log('✅ Usuario actualizado con asociacion_id\n');
  }

  // 3. Verify final state
  const { data: finalUser } = await supabase
    .from('users')
    .select('user_id, rol, estado, asociacion_id, asociaciones(nombre)')
    .eq('user_id', adminUserId)
    .single();

  console.log('=====================================');
  console.log('✅ CONFIGURACIÓN FINAL:');
  console.log('=====================================');
  console.log('User ID:', finalUser?.user_id);
  console.log('Rol:', finalUser?.rol);
  console.log('Estado:', finalUser?.estado);
  console.log('Asociación ID:', finalUser?.asociacion_id);
  console.log('Asociación:', (finalUser as any)?.asociaciones?.nombre);
  console.log('=====================================\n');

  if (finalUser?.rol === 'admin_fab' && finalUser?.estado === 'activo') {
    console.log('🎉 ¡TODO LISTO!');
    console.log('✅ Puedes hacer login con admin@admin.com');
    console.log('📍 Serás redirigido a: /dashboard/admin-fab\n');
  } else {
    console.log('❌ Aún hay problemas. Verifica los datos arriba.\n');
  }
}

fixAdminFab();
