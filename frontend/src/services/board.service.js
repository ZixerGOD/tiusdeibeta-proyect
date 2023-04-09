
// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

// const STORAGE_KEY = 'board'
const BASE_URL = 'board/'

export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyBoard,
    addBoardMsg, 
    getEmptyTaskComment
}

window.bs = boardService

async function query(filterBy = getDefaultFilter()) {
    const queryParams = `?title=${filterBy.title}&sortBy=${filterBy.sortBy}&desc=${filterBy.desc}`
    return httpService.get(BASE_URL + queryParams)
}

function getById(boardId) {
    // return storageService.get(STORAGE_KEY, boardId)
    return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
    // await storageService.remove(STORAGE_KEY, boardId)
    return httpService.delete(`board/${boardId}`)
}

async function save(board) {
    var savedBoard
    if (board._id) {
        // savedboard = await storageService.put(STORAGE_KEY, board)
        savedBoard = await httpService.put(`board/${board._id}`, board)

    } else {
        board.owner = userService.getLoggedinUser()
        // savedboard = await storageService.post(STORAGE_KEY, board)
        savedBoard = await httpService.post('board', board)
    }
    return savedBoard
}

async function addBoardMsg(boardId, txt) {
    const savedMsg = await httpService.post(`board/${boardId}/msg`, { txt })
    return savedMsg
}

function getEmptyBoard() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}

function getDefaultFilter() {
    return { title: '', sortBy: '', desc: 1 }
}

function getEmptyTaskComment(txt='',imgUrl='',byMember = {}) {
    return {
        id: utilService.makeId(),
        txt,
        createdAt: Date.now(),
        imgUrl,
        byMember
    }
}