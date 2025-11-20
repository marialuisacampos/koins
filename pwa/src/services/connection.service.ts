import { api } from './api';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface Connection {
  id: string;
  user_id_from: string;
  user_id_to: string | null;
  partner_email: string | null;
  invited_by: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  user_from?: {
    id: string;
    name: string;
    email: string;
  };
  user_to?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ConnectionState {
  status: 'no_connection' | 'invite_sent' | 'pending_request' | 'connected';
  connection?: Connection;
  pendingInvites?: Connection[];
}

export const connectionService = {
  async getConnectionState(): Promise<ConnectionState> {
    return await api.get<ConnectionState>('/api/connections');
  },

  async acceptConnection(connectionId: string): Promise<Connection> {
    return await api.patch<Connection>(`/api/connections/${connectionId}/accept`);
  },

  async rejectConnection(connectionId: string): Promise<void> {
    await api.patch(`/api/connections/${connectionId}/reject`);
  },

  async cancelInvite(connectionId: string): Promise<void> {
    await api.delete(`/api/connections/${connectionId}`);
  },

  async sendInvite(partnerEmail: string): Promise<Connection> {
    return await api.post<Connection>('/api/connections', { partnerEmail });
  },
};

