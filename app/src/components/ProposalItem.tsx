import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ENSName from './common/ENSName';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';

interface ProposalItemProps {
  id: number;
}

const ProposalItem: React.FC<ProposalItemProps> = ({ id }) => {
  const [proposal, setProposal] = React.useState<any>();
  const [proposer, setProposer] = React.useState<string>();

  const { Governance, ArtifactApplication } = useContractContext();
  const { accounts } = useWeb3Context();

  const rejectProposal = (_: React.MouseEvent): void => {
    console.log('Rejecting proposal ' + id);
    Governance.methods.reject(id).send({
      from: accounts[0],
      gasLimit: 6000000,
    });
  };

  const approveProposal = (_: React.MouseEvent): void => {
    console.log('Approving proposal ' + id);
    Governance.methods.approve(id).send({
      from: accounts[0],
      gasLimit: 6000000,
    });
  };

  React.useEffect(() => {
    ArtifactApplication.methods.getProposal(id)
      .call()
      .then((proposalData: any): void => {
        const proposal = {
          metaUri: proposalData[2],
        };
        setProposal(proposal);
        setProposer(proposalData[1]);
      })
      .catch(console.log);
  }, [ArtifactApplication, id]);

  if (!proposal || !proposer) {
    return null;
  }

  return (
    <ArtworkInfo
      artwork={proposal}
      id={id}
    >
      <Col>
        <Row>
          <Col xs={4}>
            <p className="mb-2 text-muted">Proposer </p>
          </Col>
          <Col xs={8}>
            <ENSName address={proposer}/>
          </Col>
        </Row>
        <Row>
          <ButtonGroup aria-label="Actionbar" className="mx-auto">
            <Button variant="outline-success" onClick={approveProposal}>Approve</Button>
            <Button variant="outline-danger" onClick={rejectProposal}>Deny</Button>
          </ButtonGroup>
        </Row>
      </Col>
    </ArtworkInfo>
  );
};

export default ProposalItem;
