"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { getUsers, banUser, unbanUser, User } from "@/lib/api/admin";
import styles from "./users.module.css";

export default function UsersPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banLoading, setBanLoading] = useState(false);

  useEffect(() => {
    if (!user || !token || user.role !== "admin") return;
    fetchUsers();
  }, [user, token, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(token!, currentPage, 20);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleBanClick = (user: User) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const handleBan = async () => {
    if (!selectedUser || !banReason.trim()) return;

    try {
      setBanLoading(true);
      await banUser(token!, selectedUser.id, banReason);
      setShowBanModal(false);
      setBanReason("");
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ban user");
    } finally {
      setBanLoading(false);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await unbanUser(token!, userId);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unban user");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <main className={styles.container}>
        <div className={styles.accessDenied}>
          <h1>Access Denied</h1>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <p>Manage users, bans, and subscriptions</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={styles.badge}>{u.subscriptionPlan}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[`status${u.status}`]}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(u.lastLogin).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      {u.status === "active" ? (
                        <button
                          onClick={() => handleBanClick(u)}
                          className={styles.banBtn}
                        >
                          Ban
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnban(u.id)}
                          className={styles.unbanBtn}
                        >
                          Unban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              ← Previous
            </button>

            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* Ban Modal */}
      {showBanModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Ban User</h2>
            <p className={styles.modalSubtext}>
              Are you sure you want to ban {selectedUser?.name}?
            </p>

            <div className={styles.formGroup}>
              <label>Reason for ban</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Explain why this user is being banned..."
                rows={4}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason("");
                }}
                className={styles.cancelBtn}
                disabled={banLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                className={styles.confirmBtn}
                disabled={banLoading || !banReason.trim()}
              >
                {banLoading ? "Banning..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
