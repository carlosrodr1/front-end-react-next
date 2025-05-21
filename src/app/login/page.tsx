"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setErro("");
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:7128"
        }/api/usuarios/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        }
      );

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.mensagem || "Erro ao fazer login.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      router.push("/usuarios");
    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-700">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl p-8 rounded-2xl w-full max-w-md"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
          className="mx-auto w-20 h-20 mb-4 animate-bounce"
          alt="Avatar"
        />

        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Login
        </h2>

        {erro && (
          <p className="text-red-400 text-sm mb-4 text-center">{erro}</p>
        )}

        <div className="relative mb-4">
          <AiOutlineMail
            className="absolute left-3 top-2.5 text-white/70"
            size={20}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mb-6">
          <AiOutlineLock
            className="absolute left-3 top-2.5 text-white/70"
            size={20}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-lg bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
        >
          Entrar
        </button>

        <p className="mt-6 text-center text-sm text-white/80">
          Não tem uma conta?{" "}
          <a
            href="/cadastro"
            className="text-cyan-300 underline hover:text-cyan-100"
          >
            Cadastre-se
          </a>
        </p>
      </motion.div>
    </div>
  );
}
