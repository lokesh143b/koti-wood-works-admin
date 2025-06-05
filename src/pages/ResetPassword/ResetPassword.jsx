import { useContext, useState } from 'react';
import './ResetPassword.css';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { BASE_URL } = useContext(AdminContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      return setMessage('Passwords do not match');
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to reset password');

      setMessage(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="show-password">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
