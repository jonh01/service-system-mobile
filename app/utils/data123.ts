export const data = (page: number) => {
const response = `{
  "data":[
    {
        "id": "1a2b3c4d-5678-9101-1121-314151617181",
        "name": "Example 1",
        "image": "http://picsum.photos/200/300",
        "status": "Active",
        "user": {
          "id": "1a2b3c4d-5678-9101-1121-314151617181"
        }
    },
    {
        "id": "2b3c4d5e-6789-1011-1213-141516171819",
        "name": "Example 2",
        "image": "http://picsum.photos/200/300",
        "status": "Disabled",
        "user": {
          "id": "1a2b3c4d-5678-9101-1121-314151617181"
        }
      },
      {
        "id": "3c4d5e6f-7890-1112-1314-151617181920",
        "name": "Example 3",
        "image": "http://picsum.photos/200/300",
        "status": "Active",
        "user": {
          "id": "1a2b3c4d-5678-9101-1121-314151617181"
        }
      }
    ],
    "totalPages": 2,
  "totalElements": 6,
  "numberOfElements": 3,
  "first": true,
  "last": false,
  "empty": false
}`;

const response1 = `{
  "data":[
      {
        "id": "4d5e6f7g-8901-1213-1415-161718192021",
        "name": "Example 4",
        "image": "http://picsum.photos/200/300",
        "status": "Pending",
        "user": {
          "id": "1a2b3c4d-5678-9101-1121-314151617181"
        }
      },
      {
        "id": "5h5e6f7g-8901-1213-1415-161718192021",
        "name": "Example 5",
        "image": "http://picsum.photos/200/300",
        "status": "Disabled",
        "user": {
          "id": "1a2b3c4d-5678-9101-1121-314151617181"
        }
      },
      {
        "id": "6k5e6f7g-8901-1213-1415-161718192021",
        "name": "Example 6",
        "image": "http://picsum.photos/200/300",
        "status": "Pending",
        "user": {
          "id": "1a2b3c4d-5678-9101-1121-314151617181"
        }
      }
    ],
    "totalPages": 2,
  "totalElements": 6,
  "numberOfElements": 3,
  "first": false,
  "last": true,
  "empty": false
}`;

return page === 1? response: response1;
}