import { UserDTO } from '../../../api/entities/User';
import { Dialog } from '../Core/Dialog/Dialog';

type ResetPasswordDialogProps = Readonly<{
  user: UserDTO;
  resetPassword: (userEmail: string) => Promise<void>;
  onOpenChange: () => void;
}>;

function ResetPasswordDialog({ user, resetPassword, onOpenChange }: ResetPasswordDialogProps) {
  const handleResetPassword = async () => {
    await resetPassword(user.email);
    onOpenChange();
  };

  return (
    <Dialog title='Force Reset Password' onOpenChange={onOpenChange} closeButtonText='Cancel'>
      <p>Are you sure you want to force a password reset to this user? </p>
      <ul className='dot-list'>
        <li>{user.email}</li>
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleResetPassword}>
          Set Password Reset
        </button>
      </div>
    </Dialog>
  );
}

export default ResetPasswordDialog;
