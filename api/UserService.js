import { DataService } from './index'

class User {
  login = body => {
    const url = `/api/User/Login`
    return DataService.post(url, body)
  }

  GetListTab = () => {
    const url = '/api/User/GetListTab'
    return DataService.get(url)
  }
}

const UserService = new User()

export default UserService
