/**
 * Pending Approval Banner Component
 *
 * Implements REQ-1.3.5, REQ-1.1.7: Persistent banner for users with estado="pendiente"
 *
 * This banner is displayed at the top of the page for users awaiting approval.
 * It informs them that:
 * - Their account is pending approval
 * - They have restricted access until approved
 * - They should contact support if they have questions
 *
 * Usage:
 * ```tsx
 * import { PendingApprovalBanner } from '@/components/auth/pending-approval-banner';
 *
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <PendingApprovalBanner />
 *       {children}
 *     </>
 *   );
 * }
 * ```
 */

'use client';

import { useUser } from '@/hooks/useUser';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function PendingApprovalBanner() {
  const { userRecord, isLoading } = useUser();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show banner if:
  // - User data is loading
  // - No user record
  // - User estado is not "pendiente"
  // - Banner was dismissed
  if (isLoading || !userRecord || userRecord.estado !== 'pendiente' || isDismissed) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 w-full">
      <Alert className="rounded-none border-x-0 border-t-0 border-yellow-500 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-100">
        <Clock className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          <span>Account Pending Approval</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-6 px-2 text-yellow-900 hover:bg-yellow-100 dark:text-yellow-100 dark:hover:bg-yellow-900"
          >
            Dismiss
          </Button>
        </AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>
            Your account is currently pending approval by a FAB administrator. You have limited access to the system until your account is approved.
          </p>
          <div className="flex items-start gap-2 text-sm">
            <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              You will receive an email notification once your account has been reviewed. If you have questions, please contact{' '}
              <a href="mailto:support@fab.bo" className="underline font-medium">
                support@fab.bo
              </a>
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Compact version of the pending approval banner for use in smaller spaces
 */
export function PendingApprovalBannerCompact() {
  const { userRecord, isLoading } = useUser();

  if (isLoading || !userRecord || userRecord.estado !== 'pendiente') {
    return null;
  }

  return (
    <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-3 text-sm text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-100">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <p>
          <strong>Account Pending:</strong> Your account is awaiting administrator approval. Limited access until approved.
        </p>
      </div>
    </div>
  );
}
