import React, { useState, useEffect } from 'react';
import { authService } from '/workspaces/phishing/phishing/phishing-front/src/components/services/authService.js';
import './login.css';

// Dados do form
const INITIAL_FORM_DATA = {
  username: '',
  password: ''
};

// Debug
const DEBUG_MESSAGES = {
  CHECKING_AUTH: 'Verificando autenticação...',
  USER_AUTHENTICATED: 'Usuário já autenticado',
  INVALID_TOKEN: 'Token inválido, fazendo logout...',
  NO_USER: 'Nenhum usuário autenticado',
  LOGIN_START: 'Iniciando processo de login...',
  SENDING_CREDENTIALS: 'Enviando credenciais para o servidor...',
  SAVING_TOKEN: 'Salvando token de autenticação...',
  FETCHING_USER: 'Buscando informações do usuário...',
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGIN_FAILED: 'Falha no login: '
};

const Login = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      setDebugInfo(DEBUG_MESSAGES.CHECKING_AUTH);
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUserInfo(userData);
          setDebugInfo(DEBUG_MESSAGES.USER_AUTHENTICATED);
        } catch (err) {
          console.error('Erro ao verificar autenticação:', err);
          authService.removeToken();
          setDebugInfo(DEBUG_MESSAGES.INVALID_TOKEN);
        }
      } else {
        setDebugInfo(DEBUG_MESSAGES.NO_USER);
      }
    };

    checkAuth();
  }, []);

  // Handler simples sem useCallback
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo(DEBUG_MESSAGES.LOGIN_START);

    try {
      setDebugInfo(DEBUG_MESSAGES.SENDING_CREDENTIALS);
      const response = await authService.login(formData.username, formData.password);
      
      setDebugInfo(DEBUG_MESSAGES.SAVING_TOKEN);
      authService.setToken(response.access_token);
      
      setDebugInfo(DEBUG_MESSAGES.FETCHING_USER);
      const userData = await authService.getCurrentUser();
      setUserInfo(userData);
      
      setDebugInfo(DEBUG_MESSAGES.LOGIN_SUCCESS);
      setError(DEBUG_MESSAGES.LOGIN_SUCCESS);
      
    } catch (err) {
      const errorMsg = err.message || 'Erro desconhecido';
      const fullErrorMsg = `Erro: ${errorMsg}`;
      setError(fullErrorMsg);
      setDebugInfo(`${DEBUG_MESSAGES.LOGIN_FAILED}${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUserInfo(null);
    setFormData(INITIAL_FORM_DATA);
    setDebugInfo(DEBUG_MESSAGES.NO_USER);
  };

  const redirectToAdmin = () => {
    window.location.href = '/admin';
  };

  const redirectToHome = () => {
    window.location.href = '/';
  };

  // Componentes simples sem useCallback
  const DebugInfo = () => (
    debugInfo && (
      <div className="debugInfo">
        <h4>Debug Info:</h4>
        <pre>{debugInfo}</pre>
      </div>
    )
  );

  const AlertMessage = () => {
    if (!error) return null;
    const isSuccess = error.includes('sucesso');
    return (
      <div className={`alert ${isSuccess ? 'alertSuccess' : 'alertError'}`}>
        {error}
      </div>
    );
  };

  if (userInfo) {
    return (
      <div className="loginContainer">
        <div className="loginCard">
          <div className="header">
            <h2>Login</h2>
          </div>
          <div className="actionsSection">
            {userInfo?.is_admin && (
              <button onClick={redirectToAdmin} className="btn btnPrimary">
                Acessar Painel Admin Completo
              </button>
            )}
            <button onClick={redirectToHome} className="btn btnSecondary">
              Ir para Página Inicial
            </button>
            <button onClick={handleLogout} className="btn btnDanger">
              Sair do Sistema
            </button>
          </div>
          <DebugInfo />
        </div>
      </div>
    );
  }

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <div className="header">
          <h2>Login</h2>
        </div>
        
        <form onSubmit={handleLogin} className="loginForm">
          <div className="formGroup">
            <label htmlFor="username" className="formLabel">
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="usuario"
              required
              disabled={loading}
              className="formInput"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password" className="formLabel">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="senha"
              required
              disabled={loading}
              className="formInput"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`btn btnPrimary loginBtn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processando...
              </>
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>
        
        <AlertMessage />
        <DebugInfo />
      </div>
    </div>
  );
};

export default Login;