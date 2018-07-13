import * as React from 'react';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Badge } from 'reactstrap';

import { IStageDocument } from 'core/models';
import { DATE_FORMAT } from './constants';

type ScheduleStageProps = {
    stage: IStageDocument;
    isAdmin: boolean;
    onEditStage: () => void;
    onDeleteStage: () => void;
};

class ScheduleStage extends React.PureComponent<ScheduleStageProps> {
    render() {
        const {
            isAdmin,
            stage: { title, startDate, endDate },
        } = this.props;
        return (
            <h3 className="text-center">
                <Badge color="primary">{title}</Badge>{' '}
                <Badge color="secondary">{`${moment(startDate).format(DATE_FORMAT)} - ${moment(endDate).format(
                    DATE_FORMAT,
                )}`}</Badge>
                {isAdmin ? (
                    <React.Fragment>
                        <Button title="Edit" size="sm" color="secondary" onClick={this.props.onEditStage}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Edit
                        </Button>
                        <Button title="Delete" size="sm" color="secondary" onClick={this.props.onDeleteStage}>
                            <FontAwesomeIcon icon={faTrashAlt} /> Delete
                        </Button>
                    </React.Fragment>
                ) : null}
            </h3>
        );
    }
}

export default ScheduleStage;
