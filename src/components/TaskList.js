import { useState, useEffect } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loader from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setcompletedTasks] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", completed: false });
  const [isEditing, setisEditing] = useState(false);
  const [taskId, setTaskId] = useState("");
  const { name } = formData;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const getTasks = async () => {
    setisLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/v1/tasks`);
      setisLoading(false);
      setTasks(data.data);
    } catch (error) {
      setisLoading(false);
      return toast.error(error.message);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Please enter a name!");
    }
    try {
      const result = await axios.post(`${URL}/api/v1/tasks`, formData);
      toast.success(result.data.message);
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      console.log(error);
      return toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const result = await axios.delete(`${URL}/api/v1/tasks/${id}`);
      toast.success(result.data.message);
      getTasks();
    } catch (error) {
      console.log(error);
      return toast.error(error.message);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskId(task._id);
    setisEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      const result = await axios.put(`${URL}/api/v1/tasks/${taskId}`, formData);
      setFormData({ ...formData, name: "" });
      setisEditing(false);
      toast.success(result.data.message);
      getTasks();
    } catch (error) {
      console.log(error);
      return toast.error(error.message);
    }
  };

  const completeTask = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };
    try {
      const result = await axios.put(
        `${URL}/api/v1/tasks/${task._id}`,
        newFormData
      );
      toast.success(result.data.message);
      getTasks();
    } catch (error) {
      console.log(error);
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setcompletedTasks(cTask);
  }, [tasks]);
  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}

      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loader} alt="loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added. Please add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                completeTask={completeTask}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
