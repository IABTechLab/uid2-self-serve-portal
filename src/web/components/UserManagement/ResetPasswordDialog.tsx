import { UserDTO } from '../../../api/entities/User';
import { Dialog } from '../Core/Dialog/Dialog';
import { SuccessToast } from '../Core/Popups/Toast';

type ResetPasswordDialogProps = Readonly<{
  user: UserDTO;
  resetPassword: (userEmail: string) => Promise<void>;
  onOpenChange: () => void;
}>;

function ResetPasswordDialog({ user, resetPassword, onOpenChange }: ResetPasswordDialogProps) {
  const handleResetPassword = async () => {
    await resetPassword(user.email);
    SuccessToast('Reset password completed.');
    onOpenChange();
  };

  return (
    <Dialog title='Reset Password' onOpenChange={onOpenChange} closeButtonText='Cancel'>
      <p>Are you sure you want to force a password reset for this user? </p>
      <ul className='dot-list'>
        <li>{user.email}</li>
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>
    </Dialog>
  );
}

export default ResetPasswordDialog;
