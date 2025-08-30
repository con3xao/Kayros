exports.commandCep = async (args, enviarMensagem) => {
  const cep = args[0]; 

  if (!cep || cep.length < 8 || cep.length > 9) {
    await enviarMensagem("❗ Você precisa digitar um CEP válido!");
    return;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const address = await response.json();

    if (address.erro) {
      await enviarMensagem("❌ Não encontrei este CEP nos meus dados. Tente novamente!");
      return;
    }

    const cepUser = `📦 *Informações sobre o CEP ${address.cep}:*\n\n📞 *DDD:* ${address.ddd}\n🗺️ *Estado:* ${address.uf}\n🏘️ *Bairro:* ${address.bairro}\n🚧 *Logradouro:* ${address.logradouro}`;

    await enviarMensagem(cepUser);
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    await enviarMensagem("⚠️ Ocorreu um erro ao buscar o CEP. Tente novamente.");
  }
};