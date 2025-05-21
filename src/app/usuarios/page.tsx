"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AiOutlineUser, AiOutlineMail, AiOutlineLogout } from "react-icons/ai";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:7128"
      }/api/usuarios`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) router.push("/login");
          const body = await res.json();
          throw new Error(body.mensagem || "Erro ao buscar usuários.");
        }
        return res.json();
      })
      .then(setUsuarios)
      .catch((err) => setErro(err.message));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Usuários</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded transition"
          >
            <AiOutlineLogout size={20} />
            Sair
          </button>
        </div>

        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {usuarios.map((usuario) => (
            <motion.div
              key={usuario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <AiOutlineUser size={22} />
                <p className="text-lg font-semibold">{usuario.nome}</p>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineMail size={20} />
                <p className="text-sm">{usuario.email}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
