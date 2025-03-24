import { View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function AdministrativoScreen() {
  const router = useRouter();

  return (
    <View>
      <Button title="Caixa" onPress={() => router.push("/caixa")} />
      <Button title="Cadastrar Receita" onPress={() => router.push("/cadastrar-receita")} />
      <Button title="Cadastrar Despesa" onPress={() => router.push("/cadastrar-despesa")} />
    </View>
  );
}
