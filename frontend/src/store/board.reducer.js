import { boardService } from "../services/board.service.local"

export const SET_BOARD = 'SET_BOARD'
export const SET_PREV_BOARD = 'SET_PREV_BOARD'
export const SET_BOARDS = 'SET_BOARDS'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const UNDO_REMOVE_BOARD = 'UNDO_REMOVE_BOARD'
export const SET_FILTERBY = 'SET_FILTERBY'

const initialState = {
    board: {},
    prevBoard: {},
    boards: [],
    lastRemovedBoard: null,
    filterBy: boardService.getDefaultFilter()
}

export function boardReducer(state = initialState, action) {
    let newState = state
    let boards
    let board

    switch (action.type) {
        case SET_BOARD:
            newState = { ...state, board: action.board }
            break
        case SET_PREV_BOARD:
            newState = { ...state, prevBoard: action.prevBoard }
            break
        case SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break
        case REMOVE_BOARD:
            const lastRemovedboard = state.boards.find(board => board._id === action.boardId)
            boards = state.boards.filter(board => board._id !== action.boardId)
            newState = { ...state, boards, lastRemovedboard }
            break
        case ADD_BOARD:
            newState = { ...state, boards: [...state.boards, action.board] }
            break
        case UPDATE_BOARD:
            boards = state.boards.map(board => (board._id === action.board._id) ? action.board : board)
            board = (state?.board._id === action.board._id) ? action.board : board
            newState = { ...state, boards, board }
            break

        case UNDO_REMOVE_BOARD:
            if (state.lastRemovedboard) {
                newState = { ...state, boards: [...state.boards, state.lastRemovedboard], lastRemovedboard: null }
            }
            break
        case SET_FILTERBY:
            if (state.filterBy) {
                newState = { ...state, filterBy: action.filterBy }
            }
            break
        default:
    }
    return newState
}
