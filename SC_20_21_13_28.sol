// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract SC_20_21_13_28 {
    using Strings for uint256;
    
    // Attribute Management
    mapping(string => mapping(string => uint)) doctorIsAuthorized;
    mapping(string => mapping(string => uint)) doctorSpecialization;
    mapping(string => mapping(string => uint)) doctorHasAccessRights;
    mapping(string => mapping(string => uint)) datasetLocation;

    uint public calls;
    mapping(string => mapping(string => mapping(string => uint))) policy;
    mapping(string => uint) indexResolver;
    mapping(uint => mapping(uint => mapping(uint => bool))) clauseResults;

    uint categoryCount;
    mapping(uint => uint) attributeCounts;
    mapping(uint => mapping(uint => uint)) valueCounts;

    mapping(string => string) payload;
    mapping(string => string) policyResults;

    // Store dataset-specific access control policies
    mapping(string => mapping(string => mapping(string => uint))) datasetPolicies;

    constructor() {
        // Attribute Management
        doctorIsAuthorized["doc123"]["hospitalA"] = 1;
        doctorSpecialization["doc123"]["Cardiology"] = 1;
        doctorHasAccessRights["doc123"]["Read-Write"] = 1;

        datasetLocation["hospitalA"]["Cloud"] = 1;
        datasetLocation["hospitalB"]["Local"] = 1;

        calls = 0;

        // Policy Management
        policy["access-subject"]["isAuthorized"]["true"] = 1;
        indexResolver["access-subject"] = 1;
        indexResolver["access-subjectisAuthorized"] = 1;
        indexResolver["access-subjectisAuthorizedtrue"] = 1;
        categoryCount++;
        attributeCounts[1]++;
        valueCounts[1][1]++;

        policy["access-subject"]["specialization"]["Cardiology"] = 1;
        indexResolver["access-subjectspecialization"] = 2;
        indexResolver["access-subjectspecializationCardiology"] = 1;
        attributeCounts[1]++;
        valueCounts[1][2]++;

        policy["access-subject"]["hasAccessRights"]["Read-Write"] = 1;
        indexResolver["access-subjecthasAccessRights"] = 3;
        indexResolver["access-subjecthasAccessRightsRead-Write"] = 1;
        attributeCounts[1]++;
        valueCounts[1][3]++;

        policy["dataset"]["location"]["Cloud"] = 1;
        indexResolver["dataset"] = 2;
        indexResolver["datasetlocation"] = 1;
        indexResolver["datasetlocationCloud"] = 1;
        categoryCount++;
        attributeCounts[2]++;
        valueCounts[2][1]++;
    }

    function evaluate(string memory datasetID, string memory doctorID, string memory hospitalID, string memory specialization, string memory accessRights, string memory location) public {
        // Attribute Management
        string[12] memory request;
        uint length = 0;

        if (doctorIsAuthorized[doctorID][hospitalID] == 1) {
            request[length] = "access-subject";
            request[length + 1] = "isAuthorized";
            request[length + 2] = "true";
            length += 3;
        }

        if (doctorSpecialization[doctorID][specialization] == 1) {
            request[length] = "access-subject";
            request[length + 1] = "specialization";
            request[length + 2] = specialization;
            length += 3;
        }

        if (doctorHasAccessRights[doctorID][accessRights] == 1) {
            request[length] = "access-subject";
            request[length + 1] = "hasAccessRights";
            request[length + 2] = accessRights;
            length += 3;
        }

        if (datasetLocation[hospitalID][location] == 1) {
            request[length] = "dataset";
            request[length + 1] = "location";
            request[length + 2] = location;
            length += 3;
        }

        // Check against dataset-specific policy
        for (uint i = 0; i < length; i += 3) {
            string memory category = request[i];
            string memory attrID = request[i + 1];
            string memory value = request[i + 2];

            if (datasetPolicies[datasetID][category][attrID] == 1) {
                clauseResults[indexResolver[category]][indexResolver[append(category, attrID, "")]][indexResolver[append(category, attrID, value)]] = true;
            }
        }

        bool permit = true;

        for (uint i = 1; i <= categoryCount; i++) {
            for (uint j = 1; j <= attributeCounts[i]; j++) {
                for (uint k = 1; k <= valueCounts[i][j]; k++) {
                    if (clauseResults[i][j][k]) {
                        clauseResults[i][j][k] = false;
                    } else {
                        permit = false;
                    }
                }
            }
        }

        if (permit) {
            policyResults[datasetID] = "Permit";
        } else {
            policyResults[datasetID] = "Deny";
        }

        calls++;
    }

    function getEvaluationResult(string memory ID) public view returns (string memory) {
        return policyResults[ID];
    }

    function bytes32ToString(bytes32 x) internal pure returns (string memory) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;

        for (uint j = 0; j < 32; j++) {
            bytes1 char = bytes1(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }

        bytes memory bytesStringTrimmed = new bytes(charCount);

        for (uint j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }

        return string(bytesStringTrimmed);
    }

    function append(string memory a, string memory b, string memory c) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}
