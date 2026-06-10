import React from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { isFirestoreStorage } from '../../config/contentStorage';

const FIREBASE_AUTH_URL =
  'https://console.firebase.google.com/project/kyokushinkaikan-brasil/authentication/users';

const AdminUsers = () => {
  const { userEmail } = useAdminAuth();
  const firestoreMode = isFirestoreStorage();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuários do admin</h1>
        <p className="text-sm text-gray-600 mt-2">
          Qualquer usuário criado no Firebase Authentication com e-mail e senha pode entrar no painel
          e editar o conteúdo (desde que o Firestore esteja ativo em produção).
        </p>
      </div>

      {userEmail && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          Você está logado como <strong>{userEmail}</strong>
        </div>
      )}

      {!firestoreMode && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
          Modo local: login por senha simples (<code>REACT_APP_ADMIN_TOKEN</code>). Em produção use
          Firestore + Firebase Auth.
        </p>
      )}

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Adicionar um novo editor</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
          <li>
            Abra o{' '}
            <a
              href={FIREBASE_AUTH_URL}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Firebase Authentication
            </a>
          </li>
          <li>Confirme que o método <strong>E-mail/senha</strong> está ativado</li>
          <li>Clique em <strong>Add user</strong> e defina e-mail + senha</li>
          <li>Envie as credenciais de forma segura ao editor</li>
          <li>O usuário acessa <code>/admin/login</code> no site</li>
        </ol>
        <a
          href={FIREBASE_AUTH_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded text-sm"
        >
          Abrir Firebase Authentication
        </a>
      </section>

      <section className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-800 mb-1">Por que não criar usuário aqui no site?</p>
        <p>
          Criar contas exige o Admin SDK do Firebase no servidor. Por segurança, isso não é feito no
          navegador. Use o console acima ou, no futuro, uma Cloud Function dedicada.
        </p>
      </section>
    </div>
  );
};

export default AdminUsers;
