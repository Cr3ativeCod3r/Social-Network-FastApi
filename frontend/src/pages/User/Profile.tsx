import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { UserData } from "../../Types/User"
import ProfileTable from "./components/ProfileTable"
import axiosInstance from '../../api/axiosInstance';
import UserNotes from './components/UserNotes';
import { useAuthStore } from "../../store/authStore";


const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: string | null }>({});
  const { user } = useAuthStore();
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/users/me`,);
      setUserData(response.data);
      setEditValues({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        bio: response.data.bio,
        university: response.data.university,
        department: response.data.department,
      });

    } catch (err) {
      console.error("Błąd podczas pobierania danych użytkownika:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Autoryzacja nie powiodła się lub konto jest zablokowane. Spróbuj zalogować się ponownie.');
        } else if (err.response?.status === 404) {
          setError('Endpoint API nie został znaleziony. Sprawdź konfigurację adresu URL.');
        } else {
          setError(`Wystąpił błąd sieci: ${err.message}. Spróbuj odświeżyć stronę.`);
        }
      } else {
        setError(`Nie udało się załadować danych profilu: ${err instanceof Error ? err.message : String(err)}. Spróbuj odświeżyć stronę.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEdit = (field: string) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field: string) => {
    setEditMode(prev => ({ ...prev, [field]: false }));
    if (userData) {
      setEditValues(prev => ({ ...prev, [field]: userData[field as keyof UserData] as string | null }));
    }
  };

  const handleSave = async (field: string) => {
    try {
      const token = JSON.parse(Cookies.get('token') || '{}')?.state?.token;
      if (!token) throw new Error('Brak tokena autoryzacyjnego.');

      const payload = { [field]: editValues[field] === '' ? null : editValues[field] };

      const response = await axios.patch(`/users/me`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setUserData(prev => prev ? { ...prev, ...response.data } : null);
      setEditMode(prev => ({ ...prev, [field]: false }));
      setEditValues(prev => ({ ...prev, [field]: response.data[field] }));

    } catch (err) {
      console.error(`Błąd podczas aktualizacji pola ${field}:`, err);
      alert(`Nie udało się zapisać zmian dla ${field}. Spróbuj ponownie.`);
    }
  };

  const handleEditValueChange = (field: string, value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><p>Ładowanie profilu...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-4"><p className="text-center">{error}</p></div>;
  if (!userData) return <div className="min-h-screen flex items-center justify-center bg-white"><p>Nie znaleziono danych użytkownika.</p></div>;

  return (
    <>
    <ProfileTable
      userData={userData}
      editMode={editMode}
      editValues={editValues}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      onEditValueChange={handleEditValueChange}
    />
    </>
  );
};

export default Profile;