from pymilvus import MilvusClient, CollectionSchema, FieldSchema, DataType, IndexType, Collection
from app.schemas.common_config import ConfigParams
from app.schemas.store import LangChainStore, StoreMetaData
from typing import List

class MilvusStorer:
    def __init__(self, config: ConfigParams):
        self.config = config
        self.client = MilvusClient("./milvus.db")
        self.connection:Collection|None = None

    def delete_collection(self, collection_name: str):
        self.client.drop_collection(collection_name)

    def create_collection(self, collection_name: str):
        schema = CollectionSchema(
            fields=[
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
                FieldSchema(name="content", dtype=DataType.VARCHAR, max_length=1024, description="Store content"),
                FieldSchema(name="metadata", dtype=DataType.JSON, description="Store metadata"),
            ],
            description="Store collection",
        )

        self.connection = self.client.create_collection(collection_name,schema= schema)

    def insert(self, data: List[LangChainStore]):
        self.connection.insert(data=data)

    def search(self, query: str) -> str:
        result = self.client.search(
            collection_name=self.connection.name,
            data=[query],
            limit=1,
            output_fields=["content"],
        )
        return result[0]["content"]

    def query(self, query: str) -> str:
        result = self.client.query(
            collection_name=self.connection.name,
            filter="",
            output_fields=["content"],
            limit=1,
        )
        return result[0]["content"]