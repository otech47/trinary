const { GITHUB } = require('../config/credentials')
const github = require('../handlers/github')

console.log('github');

// const userData = github.fetchAuthUserData({ auth_key: '' })
//     .then(res => {
//         console.log('res');
//         console.log(res);
//     })

// const fetchRepos = github.fetchRepos({ auth_key: '' })
//     .then(res => {
//         console.log('fetchRepos res');
//         console.log(res);
//         res.data.map(r => {
//             console.log(r.owner);
//         })
//     })

// const userPermission = github.fetchRepoContributors({
//     auth_key: '',
//     owner: 'setlife-network',
//     repo: 'project-trinary'
// })
//     .then(res => {
//         console.log('res');
//         console.log(res.data);
//     })
//     .catch(err => {
//         console.log('err');
//         console.log(err);
//     })

// const userPermission = github.fetchRepoIssues({
//     auth_key: '',
//     owner: 'setlife-network',
//     repo: 'project-trinary',
//     state: 'all'
// })
//     .then(res => {
//         console.log('res');
//         console.log(res);
//         return res
//     })
//     .catch(err => {
//         console.log('err');
//         console.log(err);
//     })

const issues = github.fetchRepoIssues({
    auth_key: '5d43fb2bb7be3c47e53c48756d2fd8055b51a121',
    repo: 'project-trinary',
    owner: 'setlife-network'
})
    .then(res => {
        console.log('res');
        console.log(res);
        return res
    })
    .catch(err => {
        console.log('err');
        console.log(err);
    })

// const userPermission = github.fetchUserPermission({
//     auth_key: '',
//     owner: 'setlife-network',
//     repo: 'project-trinary',
//     username: 'sofiarm21'
// })
//     .then(res => {
//         console.log('res');
//         console.log(res);
//     })
//     .catch(err => {
//         console.log('err');
//         console.log(err);
//     })
