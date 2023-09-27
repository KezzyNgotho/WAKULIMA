import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useTheme, Title, Card, Paragraph } from 'react-native-paper';
import firebase from '../components/firebase'; // Import your Firebase configuration

const StaffScreen = () => {
  const theme = useTheme();
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch pending registrations from Firebase Firestore
    const pendingRegistrationsRef = firebase.firestore().collection('users').where('status', '==', 'Pending');

    pendingRegistrationsRef.onSnapshot((snapshot) => {
      const registrationData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        registrationData.push({ ...data, id: doc.id });
      });
      setPendingRegistrations(registrationData);
    });

    // Fetch admins from Firebase Firestore
    const adminsRef = firebase.firestore().collection('users').where('role', '==', 'admin');

    adminsRef.onSnapshot((snapshot) => {
      const adminData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        adminData.push({ ...data, id: doc.id });
      });
      setAdmins(adminData);
    });

    // Fetch salespersons from Firebase Firestore
    const salespersonsRef = firebase.firestore().collection('users').where('role', '==', 'salesperson');

    salespersonsRef.onSnapshot((snapshot) => {
      const salespersonData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        salespersonData.push({ ...data, id: doc.id });
      });
      setSalespersons(salespersonData);
    });
  }, []);

  const handleReviewRegistration = (registration) => {
    setSelectedRegistration(registration);
    setModalVisible(true);
  };

  const handleApproveRegistration = (registration) => {
    // Update registration status in Firebase Firestore
    const registrationRef = firebase.firestore().collection('users').doc(registration.id);

    registrationRef
      .update({
        status: 'Approved',
      })
      .then(() => {
        // Remove the approved registration from the pending registrations list
        setPendingRegistrations((prevRegistrations) =>
          prevRegistrations.filter((reg) => reg.id !== registration.id)
        );
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error approving registration:', error);
      });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Title style={{ fontSize: 24, marginBottom: 20 }}>Admin Dashboard</Title>

      <Text>Pending Registrations:</Text>
      <FlatList
        data={pendingRegistrations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={{
              marginVertical: 10,
              padding: 16,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Card.Content>
              <Paragraph>User ID: {item.id}</Paragraph>
              <Paragraph>Email: {item.email}</Paragraph>
              <Paragraph>Status: {item.status}</Paragraph>
              {item.status === 'Pending' && (
                <TouchableOpacity
                  onPress={() => handleReviewRegistration(item)}
                  style={{
                    marginTop: 10,
                    padding: 8,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                    }}
                  >
                    Review
                  </Text>
                </TouchableOpacity>
              )}
            </Card.Content>
          </Card>
        )}
      />

      <Text>List of Admins:</Text>
      <FlatList
        data={admins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={{
              marginVertical: 10,
              padding: 16,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Card.Content>
              <Paragraph>User ID: {item.id}</Paragraph>
              <Paragraph>Email: {item.email}</Paragraph>
              <Paragraph>Role: {item.role}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />

      <Text>List of Salespersons:</Text>
      <FlatList
        data={salespersons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={{
              marginVertical: 10,
              padding: 16,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Card.Content>
              <Paragraph>User ID: {item.id}</Paragraph>
              <Paragraph>Email: {item.email}</Paragraph>
              <Paragraph>Role: {item.role}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <Title style={{ fontSize: 20 }}>Review Registration</Title>
          {selectedRegistration && (
            <Card
              style={{
                marginVertical: 10,
                padding: 16,
                backgroundColor: theme.colors.surface,
              }}
            >
              <Card.Content>
                <Paragraph>User ID: {selectedRegistration.id}</Paragraph>
                <Paragraph>Email: {selectedRegistration.email}</Paragraph>
                <TouchableOpacity
                  onPress={() => handleApproveRegistration(selectedRegistration)}
                  style={{
                    marginTop: 10,
                    padding: 8,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                    }}
                  >
                    Approve
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 10,
                    padding: 8,
                    backgroundColor: theme.colors.error,
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default StaffScreen;
