import { useState } from "react";

import { updateTask } from "../store/board.actions";
import { showSuccessMsg } from "../services/event-bus.service";
import { TaskDetails } from "./task-details";
import { DynamicCmp } from "./dynamicCmps/dynamic-cmp.jsx";
import { CHANGE_TASK_TITLE, DELETE_TASK, DUPLICATE_TASK, UPDATE_TASK_CHECKED, UPDATE_TASK_LABEL_NUMBER, UPDATE_TASK_LABEL_TEXT } from "../services/board.service.local";

import { MenuButton, Menu, MenuItem, Icon, EditableHeading, Counter } from 'monday-ui-react-core'
import { Open, Duplicate, Delete, AddUpdate, Update } from 'monday-ui-react-core/icons'

export function TaskPreview({ task, board, group, openModal, provided, snapshot, setIsDndModeDisabled, setIsCheckedShow }) {

    const [isOpenDetails, setIsOpenDetails] = useState(false)

    function onDuplicateTask(taskToDuplicate) {
        const data = { taskToDuplicate, id: taskToDuplicate.id, groupId: group.id }
        updateTask(board, data, DUPLICATE_TASK)
        showSuccessMsg(`Task duplicated successfully`)
    }

    function onFinishEditingInTask(value) {
        let taskChanges = { title: value, taskId: task.id, groupId: group.id }
        updateTask(board, taskChanges, CHANGE_TASK_TITLE)
    }

    function onDeleteTask(taskToDelete) {
        const data = { taskId: taskToDelete.id, groupId: group.id }

        updateTask(board, data, DELETE_TASK)
        showSuccessMsg(`Task deleted successfully`)
    }

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'number' ? +value : value

        const data = { taskId: task.id, groupId: group.id, labelPick: value }
        let updateType = type === 'number' ? UPDATE_TASK_LABEL_NUMBER : UPDATE_TASK_LABEL_TEXT

        updateTask(board, data, updateType)
    }

    function handleChangeTaskChecked({ target }, taskId) {

        updateTask(board, { taskId, checked: target.checked, groupId: group.id }, UPDATE_TASK_CHECKED)

    }

    return <section className={`task-preview ${snapshot.isDragging ? 'dragged-task' : ''} `}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
    >

        <div className="task"
            style={{ backgroundColor: task.isChecked ? '#cce5ff' : 'white' }}

        >

            <div className="task-edit-wrapper"
                style={{ backgroundColor: task.isChecked ? '#cce5ff' : 'white' }}
            >
                <div className="menu-btn-container"
                    style={{ display: snapshot.isDragging ? 'none' : '' }}>

                    <MenuButton className="task-preview-menu-btn"
                    >
                        <Menu
                            id="menu"
                            size="medium"
                            style={{
                                backgroundColor: 'red',
                                color: 'red'
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setIsOpenDetails(!isOpenDetails);
                                    setIsDndModeDisabled(true);
                                }}
                                icon={Open}
                                title="Open"
                            />
                            <MenuItem
                                onClick={() => onDuplicateTask(task)}
                                icon={Duplicate}
                                title="Duplicate Task"
                            />
                            <MenuItem
                                onClick={() => onDeleteTask(task)}
                                icon={Delete}
                                title="Delete"
                            />
                        </Menu>
                    </MenuButton>
                </div>

                <div style={{ backgroundColor: group.style }} className='left-border-task'></div>

                <div className='checkbox-row-container-task'
                    onClick={() => setIsCheckedShow(true)}>
                    <input className='row-checkbox-task'
                        onChange={(ev) => handleChangeTaskChecked(ev, task.id)}
                        type="checkbox" checked={task.isChecked} />

                </div>

                <div className="task-name-cell" >
                    <EditableHeading className='task-title' onFinishEditing={onFinishEditingInTask} type={EditableHeading.types.h5} value={task.title} />
                </div>
                <div className="msg-btn-container" onClick={() => {
                    setIsOpenDetails(!isOpenDetails)
                    setIsDndModeDisabled(true)
                }}
                >

                    <button className="msg-btn" style={task.comments ? { paddingRight: '5px' } : { paddingRight: '19px', paddingLeft: '20px' }}>

                        {!task.comments && <Icon SVG="AddUpdate" iconType={Icon.type.SVG} icon={AddUpdate} iconLabel="Task Details" iconSize={24} />}
                        {task.comments && <div className="storybook-counter_position">
                            <Icon icon={Update} iconSize={24} style={{ color: '#0073ea' }} />
                            <Counter count={
                                (Array.isArray(task.comments) ? task.comments.length : 0)
                                + (Array.isArray(task.pinnedComments) ? task.pinnedComments.length : 0)
                            } size={Counter.sizes.SMALL} className='counter-comments' />

                        </div>}
                    </button>
                </div>

            </div>
            <div className="task-cells-row-container">
                <div className="main-labels-container flex">

                    {board.cmpsOrder.map((cmp, idx) => {

                        return (
                            <DynamicCmp
                                key={idx.toString()}
                                cmp={{ cmp, task, groupId: group.id }}
                                info={{
                                    status: task?.status,
                                    members: task?.members,
                                    dueDate: task?.dueDate,
                                    priority: task?.priority,
                                    labelStatus: task?.labelStatus,
                                    number: task?.number,
                                }}
                                openModal={openModal}
                                handleChange={handleChange}
                            />
                        )
                    }
                    )}

                </div>
            </div>
            {isOpenDetails && <TaskDetails
                board={board}
                task={task}
                group={group}
                isOpenDetails={isOpenDetails}
                setIsOpenDetails={setIsOpenDetails}
                setIsDndModeDisabled={setIsDndModeDisabled} />}
        </div>

    </section>
}
