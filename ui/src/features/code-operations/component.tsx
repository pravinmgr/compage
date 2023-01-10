import React from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectGenerateCodeStatus} from './slice';
import Button from "@mui/material/Button";
import {generateCodeAsync} from "./async-apis/generateCode";
import {getCurrentProject, getCurrentState} from "../../utils/localstorage-client";
import {selectGetProjectData, selectUpdateProjectData} from "../projects/slice";
import {removeUnwantedKeys} from "../../components/diagram-maker/helper/helper";
import * as _ from "lodash";

export const GenerateCode = () => {
    const generateCodeStatus = useAppSelector(selectGenerateCodeStatus);
    const getProjectData = useAppSelector(selectGetProjectData);
    const updateProjectData = useAppSelector(selectUpdateProjectData);

    const dispatch = useAppDispatch();

    // When clicked, dispatch `generateCode`
    const handleGenerateCodeClick = () => {
        const currentProject: string = getCurrentProject();
        const generateCodeRequest = {
            projectId: currentProject
        };
        if (generateCodeStatus !== 'loading') {
            dispatch(generateCodeAsync(generateCodeRequest));
        }
    };

    const IsAnyRequiredValueMissingInOneOfNodes = (removeUnwantedKeysGetCurrentState: any) => {
        //nodes
        for (let key in removeUnwantedKeysGetCurrentState.nodes) {
            const name = removeUnwantedKeysGetCurrentState.nodes[key]?.consumerData.name
            if (!name) {
                return true;
            }
            const serverTypes = removeUnwantedKeysGetCurrentState.nodes[key]?.consumerData.serverTypes
            if (!serverTypes || serverTypes === "" || serverTypes === "[]") {
                return true;
            }
        }
        // edges
        for (let key in removeUnwantedKeysGetCurrentState.edges) {
            const name = removeUnwantedKeysGetCurrentState.edges[key]?.consumerData.name
            if (!name) {
                return true;
            }
            const clientTypes = removeUnwantedKeysGetCurrentState.nodes[key]?.consumerData.serverTypes
            if (!clientTypes || clientTypes === "" || clientTypes === "[]") {
                return true;
            }
        }
        return false;
    };

    const isDisabled = () => {
        const removeUnwantedKeysGetCurrentState = removeUnwantedKeys(getCurrentState());
        // check if the updated project data has been modified.
        if (IsAnyRequiredValueMissingInOneOfNodes(removeUnwantedKeysGetCurrentState)) {
            // disable as required values are missing
            return true;
        }

        if (updateProjectData?.project?.json) {
            const removeUnwantedKeyUpdateProject = removeUnwantedKeys(JSON.parse(JSON.stringify(updateProjectData.project.json)));
            if (_.isEqual(removeUnwantedKeyUpdateProject, removeUnwantedKeysGetCurrentState)) {
                return false;
            }
        }
        // check if the get project data is different.
        if (getProjectData?.json) {
            const removeUnwantedKeyGetProject = removeUnwantedKeys(JSON.parse(JSON.stringify(getProjectData.json)));
            if (_.isEqual(removeUnwantedKeyGetProject, removeUnwantedKeysGetCurrentState)) {
                return false;
            }
        }
        return true;
    };

    return (
        <>
            <Button style={{
                width: "200px"
            }} variant="contained" disabled={isDisabled()} onClick={handleGenerateCodeClick}>
                {generateCodeStatus === "loading"
                    ? "Generating Code"
                    : "Generate Code"}
            </Button>
        </>
    );
};
