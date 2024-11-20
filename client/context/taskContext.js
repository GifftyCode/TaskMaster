import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

// const serverUrl = "https://taskfyer.onrender.com/api/v1";
const serverUrl = "http://localhost:9090/api/v1"

export const TasksProvider = ({ children }) => {
  const userId = useUserContext().user._id;
  const userBody = useUserContext().user;

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [task, setTask] = React.useState({});

  const [isEditing, setIsEditing] = React.useState(false);
  const [priority, setPriority] = React.useState("all");
  const [activeTask, setActiveTask] = React.useState(null);
  const [modalMode, setModalMode] = React.useState("");
  const [profileModal, setProfileModal] = React.useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({});
  };

  // get tasks
  const getTasks = async () => {
    const token =  JSON.parse(localStorage.getItem('token'));
    // console.log("get tasks token ",  token)

    setLoading(true);
    try {
      const response = await fetch(
        `${serverUrl}/tasks/${userId}`, 
        {
          method: "GET",
          headers:{"Authorization": `Bearer ${token}`}
        },
      );

      console.log("get tasks response ", response.data.tasks)
      const tasks = await response.json()

      setTasks(tasks);
    } catch (error) {
      console.log("Error getting tasks", error);
    }
    setLoading(false);
  };

  // get task
  const getTask = async (taskId) => {
    const token =  JSON.parse(localStorage.getItem('token'));

    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/task/${taskId}`, {headers:{"Authorization": `Bearer ${token}`}});

      setTask(response.data);
    } catch (error) {
      console.log("Error getting task", error);
    }
    setLoading(false);
  };

  const createTask = async (task) => {
    const token =  JSON.parse(localStorage.getItem('token'));

    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/task/create`, task, {headers:{"Authorization": `Bearer ${token}`}});

      console.log("Task created", res.data);

      setTasks([...tasks, res.data]);
      toast.success("Task created successfully");
    } catch (error) {
      console.log("Error creating task", error);
    }
    setLoading(false);
  };

  const updateTask = async (task) => {
    const token =  JSON.parse(localStorage.getItem('token'));

    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/task/${task._id}`, task,  {headers:{"Authorization": `Bearer ${token}`}});

      // update the task in the tasks array
      const newTasks = tasks.map((tsk) => {
        return tsk._id === res.data._id ? res.data : tsk;
      });

      toast.success("Task updated successfully");

      setTasks(newTasks);
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  const deleteTask = async (taskId) => {
    const token =  JSON.parse(localStorage.getItem('token'));

    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/task/${taskId}`, {headers:{"Authorization": `Bearer ${token}`}});

      // remove the task from the tasks array
      const newTasks = tasks.filter((tsk) => tsk._id !== taskId);

      setTasks(newTasks);
    } catch (error) {
      console.log("Error deleting task", error);
    }
  };

  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e);
    } else {
      setTask({ ...task, [name]: e.target.value });
    }
  };

  // get completed tasks
  const completedTasks = tasks.filter((task) => task.completed);

  // get pending tasks
  const activeTasks = tasks.filter((task) => !task.completed);

  useEffect(() => {
    getTasks();
  }, [userId]);

  console.log("Active tasks", activeTasks);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        tasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TasksContext);
};
