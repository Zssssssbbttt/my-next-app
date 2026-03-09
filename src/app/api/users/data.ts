import fs from 'fs';
import path from 'path';
import { User } from './types';

// 定义数据文件路径
const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

// 确保data目录存在
function ensureDataDirectory() {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('创建数据目录:', dataDir);
  }
}

// 初始化数据文件
function initializeDataFile() {
  ensureDataDirectory();
  
  if (!fs.existsSync(dataFilePath)) {
    // 如果文件不存在，创建一个空数组
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf-8');
    console.log('创建数据文件:', dataFilePath);
  }
}

// 读取所有用户
export function readUsers(): User[] {
  try {
    initializeDataFile();
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const users = JSON.parse(data);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('读取用户数据失败:', error);
    return [];
  }
}

// 写入所有用户
export function writeUsers(users: User[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), 'utf-8');
    console.log('写入用户数据成功，当前用户数:', users.length);
  } catch (error) {
    console.error('写入用户数据失败:', error);
  }
}

// 添加用户
export function addUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>): User {
  const users = readUsers();
  
  const newUser: User = {
    id: Date.now().toString(), // 使用时间戳作为ID
    name: userData.name,
    age: userData.age || '',
    email: userData.email || '',
    role: 'user', // 默认角色
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  writeUsers(users);
  
  console.log('添加用户成功:', newUser);
  return newUser;
}

// 更新用户
export function updateUser(id: string, userData: Partial<User>): User | null {
  const users = readUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return null;
  }
  
  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  writeUsers(users);
  return users[index];
}

// 删除用户
export function deleteUser(id: string): boolean {
  const users = readUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false; // 没有找到要删除的用户
  }
  
  writeUsers(filteredUsers);
  return true;
}

// 根据ID查找用户
export function findUserById(id: string): User | undefined {
  const users = readUsers();
  return users.find(user => user.id === id);
}