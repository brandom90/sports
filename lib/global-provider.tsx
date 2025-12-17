import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
// If using React Native, replace with SecureStore
// For web: use localStorage
import * as SecureStore from "expo-secure-store";
import {User, Team, WorkoutEntry,AssignedProgram} from '../types/index'


interface Workout {
  _id: string;
  name: string;
  teamId: string;
  type: string;
  workoutEntries: WorkoutEntry[];
}

interface GlobalContextType {
  isLogged: boolean;
  team: Team | null;
  user: User | null;
  workout: Workout | undefined;
  assignedPrograms: AssignedProgram[] | null;
  loading: boolean;
  refetch: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setTeam: React.Dispatch<React.SetStateAction<Team | null>>; 
  setWorkout: React.Dispatch<React.SetStateAction<Workout | undefined>>;
  setAssignedProgram: React.Dispatch<React.SetStateAction<AssignedProgram[] | null>>;

}


const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | undefined>(undefined)
  // not neeeded yet
  const [assignedPrograms, setAssignedProgram] = useState<AssignedProgram[] | null>(null)

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("jwt"); // or localStorage.getItem("jwt") for web
      if (!token) throw new Error("No token");

      const res = await fetch('/api/athletes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refetch = () => fetchUser();

  return (
    <GlobalContext.Provider
      value={{
        isLogged: !!user,
        user,
        loading,
        refetch,
        setUser,
        team,
        setTeam,
        setWorkout,
        workout,
        setAssignedProgram,
        assignedPrograms
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
