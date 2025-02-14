import conf from "../conf/conf.js";


import { Client, ID, Databases,Storage,Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }

    async createPost({title,slug,content,featuredImage,status,userId}){        
        try{
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }

            );
        }catch(error){
            console.log("   Appwrite service :: createPost :: error",error);    
        }
    }

    async updatePost(slug,{title,content,featuredImage,status}){
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    updatedAt: new Date().toISOString()
                }
            );
        }catch(error){
            console.log("   Appwrite service :: updatePost :: error",error);    
        }
    }

    async deletePost(slug){
        try{
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        }catch(error){
            console.log("   Appwrite service :: deletePost :: error",error);   
            return false; 
        }
    }

    async getPost(slug){
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        }catch(error){
            console.log("   Appwrite service :: getPost :: error",error);    
        }
    }

    async getAllPosts(queries=[Query.equal("status","active")]){
        try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        }catch(error){
            console.log("   Appwrite service :: getAllPosts :: error",error);    
        }

    }

    async uploadFile(file){
        try{
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                    ID.unique(),
                    file,
            );
        }catch(error){
            console.log("   Appwrite service :: uploadFile :: error",error);    
        }
    }

    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        }catch(error){
            console.log("   Appwrite service :: deleteFile :: error",error);    
            return false;
        }
    }

    getFilePreview(fileId){
        try{
            return this.bucket.getFilePreview(fileId);
        }catch(error){
            console.log("   Appwrite service :: getFile :: error",error);    
        }
    }

};

const service = new Service();
export default service;

