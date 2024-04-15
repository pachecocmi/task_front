<template>
    <div class="bg-neutral-200 rounded-md w-2/3 m-auto p-2 mt-24">
        <div class="grid grid-cols-2 w-1/2 m-auto mb-2">
            <div class="grid-start-1">
                <span class="text-xl">To-Do List</span>
            </div>
            <div class="grid-end-1 text-end">
                <button
                    class="text-sm bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded mr-1"
                    @click="switchMode(mode === 'list' ? 'create' : 'list')">
                    {{ mode === 'list' ? 'Create Task' : 'Back to Task List' }}
                </button>
                <button v-if="mode === 'list'"
                    class="text-sm bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                    @click="switchMode('completed')">
                    Completed</button>
            </div>
        </div>
        <div v-if="mode === 'list' || mode === 'completed'" class="w-1/2 m-auto">
            <ul>
                <li v-for="task in tasks" :key="task.id" class="mb-2 grid grid-cols-3">
                    <div class="grid-start-1" @click="switchMode('update', task)">{{ task . description }}</div>
                    <div v-if="mode === 'list'" class="grid-end-1 col-span-2 text-end">
                        <button
                            class="text-sm bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-1"
                            @click="completeTask(task.id)">Complete</button>
                        <button
                            class="text-sm bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                            @click="deleteTask(task.id)">Delete</button>
                    </div>
                </li>
            </ul>
        </div>
        <div v-else-if="mode === 'create' || mode === 'update'" class="w-1/2 m-auto">
            <h2>{{ mode === 'create' ? 'Create' : 'Update' }} Task</h2>
            <form @submit.prevent="submitForm">
                <div>
                    <label>Description:</label>
                    <input type="text" v-model="description" required>
                </div>
                <button
                    class="text-sm bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                    type="submit">{{ mode === 'create' ? 'Create' : 'Update' }}</button>
            </form>
        </div>
    </div>
</template>

<script>
    import {
        ref
    } from 'vue'; // Import ref for reactive variables
    import axios from 'axios';

    export default {
        setup() {
            const uri = 'http://taskmanager.test/api';
            let mode = ref('list'),
                tasks = ref([]),
                status = ref(0),
                id = ref(''),
                description = ref('');

            function switchMode(newMode, task) {
                mode.value = newMode;
                if (newMode == 'update') {
                    id.value = task.id,
                        description.value = task.description;
                }

                status.value = newMode == 'completed' ? 1 : 0;
            }

            async function fetchTasks() {
                try {
                    const response = await axios.post(uri + '/task/list', {
                        status: status.value
                    });
                    tasks.value = response.data.data;
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                }
            }

            async function createTask(taskData) {
                try {
                    const response = await axios.post(uri + '/task/create', taskData);
                    await fetchTasks(); // Refresh tasks after creating
                    switchMode('list');
                } catch (error) {
                    console.error('Error creating task:', error);
                }
            }

            async function updateTask(taskData) {
                try {
                    const response = await axios.post(uri + '/task/update', taskData);
                    await fetchTasks(); // Refresh tasks after updating
                    switchMode('list');
                } catch (error) {
                    console.error('Error updating task:', error);
                }
            }

            async function completeTask(taskId) {
                try {
                    const response = await axios.post(uri + '/task/complete', {
                        id: taskId
                    });
                    await fetchTasks(); // Refresh tasks after completing
                } catch (error) {
                    console.error('Error completing task:', error);
                }
            }

            async function deleteTask(taskId) {
                try {
                    const response = await axios.post(uri + '/task/delete', {
                        id: taskId
                    });
                    await fetchTasks(); // Refresh tasks after completing
                } catch (error) {
                    console.error('Error completing task:', error);
                }
            }

            function submitForm() {
                if (mode.value === 'create') {
                    createTask({
                        description: description.value
                    });
                } else if (mode.value === 'update') {
                    updateTask({
                        id: id.value,
                        description: description.value
                    })
                    // Implement update task logic
                }
            }

            fetchTasks(); // Fetch tasks when component is mounted

            return {
                mode,
                tasks,
                description,
                switchMode,
                submitForm,
                completeTask,
                deleteTask
            };
        }
    };
</script>
