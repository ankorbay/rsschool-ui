import * as React from 'react';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, FormGroup, Row } from 'reactstrap';

import { IEventDocument, IStageDocument, IStage } from 'core/models';
import ScheduleStage from './ScheduleStage';
import ModalStage, { StageFormData } from './ModalStage';
import ModalDelete from './ModalDelete';
import { INPUT_DATE_FORMAT, DELETE_STAGE_CONTEXT } from './constants';

type ScheduleProps = {
    courseId: string;
    stages: IStageDocument[];
    events: IEventDocument[];
    isAdmin: boolean;
    addStage: (stage: IStage) => void;
    updateStage: (stage: IStageDocument) => void;
};

type DeleteContext = {
    title: string;
    body: string;
    isError: boolean;
};

type ScheduleState = {
    stage: IStageDocument | undefined;
    event: IEventDocument | undefined;
    isOpenModalStage: boolean;
    isOpenModalDelete: boolean;
    deleteContext: DeleteContext | undefined;
};

class Schedule extends React.PureComponent<ScheduleProps, ScheduleState> {
    constructor(props: ScheduleProps) {
        super(props);

        this.state = {
            stage: undefined,
            event: undefined,
            isOpenModalStage: false,
            isOpenModalDelete: false,
            deleteContext: undefined,
        };
    }

    toggleOpenModalStage = (stage?: IStageDocument) => () => {
        this.setState({ stage, isOpenModalStage: !this.state.isOpenModalStage });
    };

    onCloseModalStage = () => {
        this.setState({
            stage: undefined,
            isOpenModalStage: false,
        });
    };

    onCloseModalDelete = () => {
        this.setState({
            stage: undefined,
            event: undefined,
            deleteContext: undefined,
            isOpenModalDelete: false,
        });
    };

    toggleOpenModalDeleteStage = (deleteContext?: DeleteContext, stage?: IStageDocument) => () => {
        this.setState({ stage, deleteContext, isOpenModalDelete: !this.state.isOpenModalDelete });
    };

    handleSubmitStage = ({ title, startDate, endDate }: StageFormData) => {
        const { stage } = this.state;
        const { courseId } = this.props;
        if (stage != null) {
            const data = {
                ...stage,
                title: title.trim(),
                startDate: Number(moment(startDate)),
                endDate: Number(moment(endDate)),
            };
            this.props.updateStage(data);
        } else {
            const data = {
                title: title.trim(),
                startDate: Number(moment(startDate)),
                endDate: Number(moment(endDate)),
                courseId,
            };
            this.props.addStage(data);
        }
        this.setState({ stage: undefined });
    };

    render() {
        const { isAdmin, stages } = this.props;
        const { stage, isOpenModalStage, isOpenModalDelete, deleteContext } = this.state;

        return (
            <React.Fragment>
                {isAdmin ? (
                    <Row className="text-right mb-4 mt-3">
                        <FormGroup className="col-md-12">
                            <Button color="success" onClick={console.log}>
                                <FontAwesomeIcon icon={faPlus} /> Add Session
                            </Button>{' '}
                            <Button color="success" onClick={console.log}>
                                <FontAwesomeIcon icon={faPlus} /> Add Task
                            </Button>
                        </FormGroup>
                    </Row>
                ) : null}
                {stages.map((stg, index) => {
                    return (
                        <ScheduleStage
                            key={index}
                            stage={stg}
                            isAdmin={isAdmin}
                            onEditStage={this.toggleOpenModalStage(stg)}
                            onDeleteStage={this.toggleOpenModalDeleteStage(DELETE_STAGE_CONTEXT, stg)}
                        />
                    );
                })}
                {isAdmin ? (
                    <Row className="text-center mt-5">
                        <FormGroup className="col-md-12">
                            <Button outline={true} color="secondary" onClick={this.toggleOpenModalStage()}>
                                <FontAwesomeIcon icon={faPlus} /> Add Stage
                            </Button>
                        </FormGroup>
                    </Row>
                ) : null}
                <ModalStage
                    isOpen={isOpenModalStage}
                    stage={stage}
                    onCloseModal={this.onCloseModalStage}
                    initialValues={
                        stage && {
                            title: stage.title,
                            startDate: moment(stage.startDate).format(INPUT_DATE_FORMAT),
                            endDate: moment(stage.endDate).format(INPUT_DATE_FORMAT),
                        }
                    }
                    onSubmit={this.handleSubmitStage}
                />
                {deleteContext ? (
                    <ModalDelete {...deleteContext} isOpen={isOpenModalDelete} onCloseModal={this.onCloseModalDelete} />
                ) : null}
            </React.Fragment>
        );
    }
}

export default Schedule;
