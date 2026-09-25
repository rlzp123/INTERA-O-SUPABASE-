import { useEffect, useState } from "react";
import { supabase, supabaseConfigurado } from "./supabaseClient";
import "./App.css";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  async function buscarProdutos() {
    if (!supabaseConfigurado) {
      setErro(
        "Supabase não configurado. Preencha o arquivo .env.local e reinicie o servidor (npm run dev)."
      );
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    // SELECT * FROM produtos ORDER BY id
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Erro ao buscar dados:", error.message);
      setErro(error.message);
    } else {
      console.log("✅ Dados carregados com sucesso:", data);
      setProdutos(data);
    }

    setCarregando(false);
  }

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <div className="app">
      <header className="topo">
        <h1>🛒 Produtos da Nuvem</h1>
        <p>Dados vindos direto do Supabase</p>
      </header>

      <main className="conteudo">
        <button className="botao" onClick={buscarProdutos} disabled={carregando}>
          {carregando ? "Carregando..." : "🔄 Atualizar lista"}
        </button>

        {erro && <div className="mensagem erro">⚠️ {erro}</div>}

        {!carregando && !erro && produtos.length === 0 && (
          <div className="mensagem">Nenhum produto encontrado na tabela.</div>
        )}

        <ul className="lista">
          {produtos.map((produto) => (
            <li key={produto.id} className="card">
              <span className="nome">{produto.nome}</span>
              <span className="preco">
                {Number(produto.preco).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </li>
          ))}
        </ul>
      </main>

      <footer className="rodape">Aula 08 • React + Capacitor + Supabase</footer>
    </div>
  );
}

export default App;