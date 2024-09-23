export type musicList = {
    additional: {
        description: {};
        indexed: boolean;
        mount_point_type: string;
        owner: {
            gid: number;
            group: string;
            uid: number;
            user: string;
        };
        perm: {
            acl: {
                append: boolean;
                del: boolean;
                exec: boolean;
                read: boolean;
                write: boolean;
            };
            is_acl_mode: boolean;
            posix: number;
        };
        real_path: string;
        size: number;
        time: {
            atime: number;
            crtime: number;
            ctime: number;
            mtime: number;
        };
        type: string;
    };
    isdir: boolean;
    name: string;
    path: string;
}[][]