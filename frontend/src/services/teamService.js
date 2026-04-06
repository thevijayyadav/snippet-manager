import api from './api';

const teamService = {
  createTeam: async (teamData) => {
    return (await api.post('/teams', teamData)).data;
  },
  getMyTeams: async () => {
    return (await api.get('/teams/my')).data;
  },
  addMember: async (teamId, userId) => {
    return (await api.post(`/teams/${teamId}/members/${userId}`)).data;
  }
};

export default teamService;
