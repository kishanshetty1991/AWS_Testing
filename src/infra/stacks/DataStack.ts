import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../utils';

export class DataStack extends Stack {

    public readonly kishanTable: ITable;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const suffixTableName = getSuffixFromStack(this);

        const table = new Table(this, 'KishanTable', {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            tableName: `KishanTable-${suffixTableName}`
        });
        this.kishanTable = table;
    }
}