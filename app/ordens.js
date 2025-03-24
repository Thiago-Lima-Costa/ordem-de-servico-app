
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function OrdensScreen() {
  const router = useRouter();
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarOrdens();
  }, []);

  const carregarOrdens = async () => {
    try {
      const q = query(collection(db, "ordens_servico"), orderBy("data_entrada", "desc"));
      const querySnapshot = await getDocs(q);

      const listaOrdens = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrdens(listaOrdens);
    } catch (error) {
      console.error("Erro ao carregar ordens:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/editar-ordem?id=${item.id}`)}>
      <Text style={styles.numero}>OS #{item.numero_os}</Text>
      <Text style={styles.cliente}>Cliente: {item.cliente_nome}</Text>
      <Text style={styles.produto}>Produto: {item.produto}</Text>
      <Text style={[styles.status, { color: item.status === "Concluído" ? "green" : "blue" }]}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ordens de Serviço</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={ordens}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma OS cadastrada.</Text>}
        />
      )}

      <TouchableOpacity style={styles.botaoNova} onPress={() => router.push("/nova-ordem")}>
        <Text style={styles.botaoTexto}>+ Nova OS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 10,
    elevation: 3,
  },
  numero: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cliente: {
    fontSize: 16,
  },
  produto: {
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  botaoNova: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

