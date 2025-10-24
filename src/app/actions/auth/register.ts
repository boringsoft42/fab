/**
 * Server Action: Public User Registration
 *
 * Implements REQ-1.1.1 through REQ-1.1.7
 *
 * This action handles public registration for atleta, entrenador, and juez roles.
 * Users are created with estado="pendiente" and require admin_fab approval.
 *
 * Flow:
 * 1. Create user in Supabase Auth
 * 2. Create user record in database with estado="pendiente"
 * 3. Send notification to admin_fab (TODO: Task 2.7.3)
 * 4. Send confirmation email to user (TODO: Task 2.7.4)
 */

'use server';

import { createAdminClient, createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2).max(30),
  lastName: z.string().min(2).max(30),
  rol: z.enum(['atleta', 'entrenador', 'juez']),
  asociacion_id: z.string().uuid(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export interface RegisterResult {
  success: boolean;
  error?: string;
  userId?: string;
}

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  try {
    // Validate input
    const validated = registerSchema.parse(input);

    // REQ-1.1.2: Verify role is public (not admin_fab or admin_asociacion)
    if (!['atleta', 'entrenador', 'juez'].includes(validated.rol)) {
      return {
        success: false,
        error: 'Invalid role. Public registration is only available for atleta, entrenador, and juez.',
      };
    }

    // Verify asociacion exists and is active
    const supabase = await createServerClient();
    const { data: asociacion, error: asociacionError } = await supabase
      .from('asociaciones')
      .select('id, estado')
      .eq('id', validated.asociacion_id)
      .single();

    if (asociacionError || !asociacion) {
      return {
        success: false,
        error: 'Selected asociación does not exist.',
      };
    }

    if (!asociacion.estado) {
      return {
        success: false,
        error: 'Selected asociación is not active.',
      };
    }

    // Create user in Supabase Auth using Admin API
    // REQ-1.1.3: Email verification required
    const adminClient = createAdminClient();
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: false, // Require email verification
      user_metadata: {
        first_name: validated.firstName,
        last_name: validated.lastName,
      },
    });

    if (authError || !authData.user) {
      console.error('Auth creation error:', authError);
      return {
        success: false,
        error: authError?.message || 'Failed to create user account.',
      };
    }

    // REQ-1.1.4: Create user record with estado="pendiente"
    const { error: userRecordError } = await adminClient
      .from('users')
      .insert({
        user_id: authData.user.id,
        rol: validated.rol,
        estado: 'pendiente', // REQ-1.3.1: Default to pendiente
        asociacion_id: validated.asociacion_id,
      });

    if (userRecordError) {
      console.error('User record creation error:', userRecordError);

      // Rollback: Delete auth user if user record creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id);

      return {
        success: false,
        error: 'Failed to create user record. Please try again.',
      };
    }

    // TODO: Task 2.7.3 - Send notification to admin_fab
    // TODO: Task 2.7.4 - Send confirmation email to user

    return {
      success: true,
      userId: authData.user.id,
    };

  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid input data.',
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
