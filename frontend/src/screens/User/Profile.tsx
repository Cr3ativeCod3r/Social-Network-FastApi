import React, { useState, useEffect } from 'react';
import type { UserData } from "../../Types/User"
import ProfileTable from "../../modules/User/components/ProfileTable"
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: string | null }>({});
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
      const payload = { [field]: editValues[field] === '' ? null : editValues[field] };

      const response = await axiosInstance.patch(`/users/me`, payload, {
      });

      setUserData(prev => prev ? { ...prev, ...response.data } : null);
      setEditMode(prev => ({ ...prev, [field]: false }));
      setEditValues(prev => ({ ...prev, [field]: response.data[field] }));

    } catch (err) {
      console.error(`Błąd podczas aktualizacji pola ${field}:`, err);
      toast.error(`Nie udało się zapisać zmian dla ${field}. Spróbuj ponownie.`);
    }
  };

  const handleEditValueChange = (field: string, value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

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