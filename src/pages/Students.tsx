import { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  coarse: string;
  joined: string;
}

const initialStudents: Student[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "Active", coarse: "Computer Science", joined: "2024-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", status: "Inactive", coarse: "Mathematics", joined: "2024-02-20" },
  { id: "3", name: "Carol White", email: "carol@example.com", status: "Active", coarse: "Physics", joined: "2024-03-10" },
  { id: "4", name: "David Brown", email: "david@example.com", status: "Active", coarse: "Chemistry", joined: "2024-04-05" },
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newStudent: Student = {
      id: Date.now().toString(),
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      coarse: String(data.get("coarse") ?? ""),
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
    };
    setStudents((prev) => [...prev, newStudent]);
    setShowAddModal(false);
    form.reset();
  };

  const handleEditOpen = (student: Student) => {
    setEditId(student.id);
    setEditStudent(student);
  };

  const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === editId
          ? {
              ...s,
              name: String(data.get("name") ?? ""),
              email: String(data.get("email") ?? ""),
              coarse: String(data.get("coarse") ?? ""),
            }
          : s
      )
    );
    setShowEditModal(false);
    setEditId(null);
    setEditStudent(null);
  };

  const handleDeleteConfirm = () => {
    setStudents((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.coarse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Students</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          + Add Student
        </button>
      </div>

      <input
        type="text"
        placeholder="Search students..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full max-w-sm px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />

      <div className="overflow-x-auto rounded-2xl shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr
                key={student.id}
                className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{student.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{student.email}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{student.coarse}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      student.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{student.joined}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => { handleEditOpen(student); setShowEditModal(true); }}
                    className="text-indigo-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(student.id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Add Student</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input name="name" required placeholder="Name" className="w-full border px-3 py-2 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <input name="email" required type="email" placeholder="Email" className="w-full border px-3 py-2 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <input name="coarse" required placeholder="Course" className="w-full border px-3 py-2 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl border dark:border-gray-600 dark:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Edit Student</h2>
            <form onSubmit={handleEditSave} className="space-y-3">
              <input name="name" required defaultValue={editStudent.name} placeholder="Name" className="w-full border px-3 py-2 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <input name="email" required type="email" defaultValue={editStudent.email} placeholder="Email" className="w-full border px-3 py-2 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <input name="coarse" required defaultValue={editStudent.coarse} placeholder="Course" className="w-full border px-3 py-2 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-xl border dark:border-gray-600 dark:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <h2 className="text-lg font-bold mb-2 dark:text-white">Delete Student?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">This action cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border dark:border-gray-600 dark:text-white">Cancel</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
