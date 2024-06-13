# import datetime
import datetime
import json
import time

import pytds
# import time

# import MySQLdb
# import pytds
from channels.generic.websocket import AsyncWebsocketConsumer

CLOUD_HOST = "itamr.readmeter.in"
CLOUD_DATABASE = "AMRDatalog"
CLOUD_USER = "Ramkumar"
CLOUD_PASS = "Itsipl123"
SUBSCRIBER_ID = 183
# TRANSMITTER_ID = 339
SET_POINT = 10

class DashboardConsumer(AsyncWebsocketConsumer):
    room_name = None
    sub_id = None
    room_group_name = None
    client = None
    db_local = None

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

    async def connect(self):
        print(self.scope["url_route"]["kwargs"])
        self.room_name = self.scope["url_route"]["kwargs"]["user_name"]
        self.room_group_name = self.room_name
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )
        await self.accept()
        # try:
        #     self.db_local.close()
        # except:
        #     pass
        # self.db_local = MySQLdb.connect(host="localhost",
        #                            user="root",
        #                            passwd="Itsipl123",
        #                            db="iReM_RaspBerry")
        # cursor_local = self.db_local.cursor()
        # # create a mysql table named tmFilterBedStatus with TransmitterID(int) as non-autoincrementing primary key with other nullable columns ReadingTime(datetime), pressure1(float), pressure2(float), loh(float), rof(float), currentStatus(string), previousStatus(string), previousStatusChangeTime(datetime), lastBackwashTime(datetime)
        # query_string = """CREATE TABLE tmFilterBedStatus (
        #                         TransmitterID INT NOT NULL,
        #                         ReadingTime INT,
        #                         pressure1 FLOAT,
        #                         pressure2 FLOAT,
        #                         loh FLOAT,
        #                         rof FLOAT,
        #                         currentStatus VARCHAR(255),
        #                         previousStatus VARCHAR(255),
        #                         previousStatusChangeTime INT,
        #                         lastBackwashTime INT,
        #                         PRIMARY KEY (TransmitterID)
        #                     );
        #                     """
        # try:
        #     cursor_local.execute(query_string)
        # except:
        #     pass
        # cursor_local.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    @staticmethod
    async def setObj(obj, name, row):
        obj[name]["name"] = row[1]
        obj[name]["time"] = ((row[4] - datetime.datetime(1970, 1, 1)) / datetime.timedelta(seconds=1)) - 19800
        obj[name]["value"] = float(row[5])
        obj[name]["uom"] = row[3]
        obj[name]["parameter"] = row[2]

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        if message == "UPDATE":
            try:

                sub_id = text_data_json['sub_id']
                with pytds.connect(CLOUD_HOST, CLOUD_DATABASE, CLOUD_USER, CLOUD_PASS,
                                   timeout=10) as conn:
                    # 3514314
                    with conn.cursor() as cursor:
                        cursor.execute(
                            f"""SELECT	mxM.MeterID,
                                        mM.[Name] as [Name],
                                        mP.[Name] as Parameter,
                                        mU.[Name] as UOM,
                                        mxDFS.[Closing_DateTime] as Last_Date_Time,
                                        mxM.[Value],
                                        mS.[Name] as SubscriberName,
                                        mxMGR.MeterGroupID as MGId,
                                        mM.Aliasname1 as Alias,
										mxDFS.[Status],
										mxDFS.[Duration]
                                        FROM mxMeters_LastData mxM
                                LEFT JOIN mMeters mM on mM.MeterID = mxM.MeterID
								LEFT JOIN mxDJBFilterbed_Status mxDFS on mM.TransmitterID = mxDFS.TransmitterID
                                LEFT JOIN mParameters mP ON mP.ParameterID = mxM.ParameterID 
                                LEFT JOIN mUOMS mU ON mU.UOMID = mP.UOMID 
                                LEFT JOIN mSubscribers mS ON mS.SubscriberID = mxM.SubscriberID 
                                LEFT JOIN mxMeters_MeterGroups mxMGR ON mxMGR.MeterID = mxM.MeterID 
                                Where mxM.SubscriberID = {sub_id};""")

                        desc, data = cursor.description, cursor.fetchall()
                        transmitters_data = {}
                        for row in data:
                            if row[7] is not None:
                                if not transmitters_data.get(row[7]):
                                    transmitters_data[row[7]] = {
                                        "status": "",
                                        "alias": "",
                                        # "previousStatus": 0,
                                        # "previousStatusChangeTime": 0,
                                        # "lastBackwashTime": 0,
                                        "lastDataReceived": 0,
                                        "runDuration": 0,
                                        "loh": {"name": None, "value": 0, "uom": None, "parameter": None},
                                        "rof": {"name": None, "value": 0, "uom": None, "parameter": None},
                                        "press1": {"name": None, "value": 0, "uom": None, "parameter": None},
                                        "press2": {"name": None, "value": 0, "uom": None, "parameter": None},
                                    }
                                try:
                                    transmitters_data[row[7]]['alias'] = row[8].split("_")[1]
                                except:
                                    pass
                                try:
                                    transmitters_data[row[7]]['status'] = row[9]
                                except:
                                    pass
                                try:
                                    transmitters_data[row[7]]['lastDataReceived'] = int(row[4].timestamp())
                                except:
                                    pass
                                try:
                                    transmitters_data[row[7]]['runDuration'] = row[10]
                                except:
                                    pass
                                if row[2] == "LOH":
                                    await self.setObj(transmitters_data[row[7]], "loh", row)
                                    # transmitters_data[row[7]]["lastDataReceived"] = min(transmitters_data[row[7]]["lastDataReceived"], transmitters_data[row[7]]["loh"]["time"])
                                elif row[2] == "ROF":
                                    await self.setObj(transmitters_data[row[7]], "rof", row)
                                    # transmitters_data[row[7]]["lastDataReceived"] = min(transmitters_data[row[7]]["lastDataReceived"], transmitters_data[row[7]]["rof"]["time"])
                                elif row[2] == "Pressure":
                                    if transmitters_data[row[7]]["press1"]["name"] is None:
                                        await self.setObj(transmitters_data[row[7]], "press1", row)
                                        # transmitters_data[row[7]]["lastDataReceived"] = min(transmitters_data[row[7]]["lastDataReceived"], transmitters_data[row[7]]["press1"]["time"])
                                    else:
                                        await self.setObj(transmitters_data[row[7]], "press2", row)
                                        # transmitters_data[row[7]]["lastDataReceived"] = min(transmitters_data[row[7]]["lastDataReceived"], transmitters_data[row[7]]["press2"]["time"])

                            caption = row[6]

                        # for t_id in transmitters_data.keys():
                        #     # print((datetime.datetime.now().timestamp() - transmitters_data[t_id]["lastDataReceived"]) < 600)
                        #     if (datetime.datetime.now().timestamp() - transmitters_data[t_id]["lastDataReceived"]) < 1800:
                        #         if transmitters_data[t_id]["rof"]["value"] > 0:
                        #             transmitters_data[t_id]["status"] = "Filtration"
                        #         elif transmitters_data[t_id]["rof"]["value"] == 0 and ((transmitters_data[t_id]["press1"]["value"] > 0) or (transmitters_data[t_id]["press2"]["value"] > 0)):
                        #             transmitters_data[t_id]["status"] = "Backwash"
                        #         else:
                        #             transmitters_data[t_id]["status"] = "Idle"

                        #     else:
                        #         transmitters_data[t_id]["status"] = "Maintenance"
                        # print(transmitters_data)
                        # cursor_local = self.db_local.cursor()
                        # for key in transmitters_data.keys():
                        #     #                                  0               1        2       3    4       5
                        #     cursor_local.execute(f"""SELECT ReadingTime, pressure1, pressure2, loh, rof, currentStatus,
                        #     previousStatus, previousStatusChangeTime, lastBackwashTime FROM tmFilterBedStatus Where TransmitterID = {key};""")
                        #     #    6                   7                    8
                        #     if cursor_local.rowcount > 0:
                        #         table_data = cursor_local.fetchall()[0]
                        #         table_currentStatus = int(table_data[5])
                        #     else:
                        #         table_currentStatus = 0
                        #     if transmitters_data[key]["rof"]["time"] == transmitters_data[key]["loh"]["time"] == transmitters_data[key]["press1"]["time"] == transmitters_data[key]["press2"]["time"]:
                        #         ReadingTime = transmitters_data[key]["rof"]["time"]
                        #         if transmitters_data[key]["rof"]["value"] > 0:
                        #             transmitters_data[key]["status"] = 1
                        #         elif transmitters_data[key]["rof"]["value"] == 0 and ((SET_POINT > transmitters_data[key]["press1"]["value"] > 0) or (SET_POINT > transmitters_data[key]["press2"]["value"] > 0)):
                        #             transmitters_data[key]["status"] = 2
                        #         else:
                        #             transmitters_data[key]["status"] = 3
                        #         if transmitters_data[key]["status"] != int(table_currentStatus):
                        #             transmitters_data[key]['previousStatus'] = int(table_currentStatus)
                        #             transmitters_data[key]['previousStatusChangeTime'] = ReadingTime
                        #             if transmitters_data[key]["status"] == 2:
                        #                 transmitters_data[key]['lastBackwashTime'] = ReadingTime
                        #
                        #         cursor_local.execute(f"""INSERT INTO tmFilterBedStatus(TransmitterID, ReadingTime, pressure1, pressure2, loh, rof, currentStatus, previousStatus, previousStatusChangeTime, lastBackwashTime) VALUES({key}, {transmitters_data[key]["rof"]["time"]}, {transmitters_data[key]["press1"]["value"]}, {transmitters_data[key]["press2"]["value"]}, {transmitters_data[key]["loh"]["value"]}, {transmitters_data[key]["rof"]["value"]}, {transmitters_data[key]["status"]}, {transmitters_data[key]['previousStatus']}, {transmitters_data[key]['previousStatusChangeTime']}, {transmitters_data[key]['lastBackwashTime']})
                        #                                 ON DUPLICATE KEY UPDATE ReadingTime = {transmitters_data[key]["rof"]["time"]}, pressure1 = {transmitters_data[key]["press1"]["value"]}, pressure2 = {transmitters_data[key]["press2"]["value"]}, loh = {transmitters_data[key]["loh"]["value"]}, rof = {transmitters_data[key]["rof"]["value"]}, currentStatus = {transmitters_data[key]["status"]}, previousStatus = {transmitters_data[key]['previousStatus']}, previousStatusChangeTime = {transmitters_data[key]['previousStatusChangeTime']}, lastBackwashTime = {transmitters_data[key]['lastBackwashTime']}""")
                # self.db_local.commit()
                # cursor_local.close()
                # transmitters_data = {"336": {"name": "FILTER BED 01", "status": "Filtration", "rof": "324.43",
                #                              "loh": "23.4", "press1": "0", "press2": "0", "runtime": "13200",
                #                              "start_time": "2024-04-25 14:10:00", "last_backwash": "2024-04-25 05:55:00", "maintenance": "0"},
                #                      "337": {"name": "FILTER BED 02", "status": "Backwash", "rof": "0",
                #                              "loh": "0", "press1": "2.8", "press2": "3.1", "runtime": "17800",
                #                              "start_time": "2024-04-25 17:55:00", "last_backwash": "2024-04-24 13:21:00", "maintenance": "0"},
                #                      "338": {"name": "FILTER BED 03", "status": "Idle", "rof": "0",
                #                              "loh": "0", "press1": "0", "press2": "0", "runtime": "1500",
                #                              "start_time": "2024-04-25 18:50:00", "last_backwash": "2024-04-25 11:44:00", "maintenance": "0"},
                #                      "339": {"name": "FILTER BED 04", "status": "Filtration", "rof": "512.6",
                #                              "loh": "11.1", "press1": "0", "press2": "0", "runtime": "4500",
                #                              "start_time": "2024-04-25 18:50:00", "last_backwash": "2024-04-25 11:44:00", "maintenance": "0"},
                #                      "340": {"name": "FILTER BED 05", "status": "Filtration", "rof": "324.43",
                #                              "loh": "55.1", "press1": "0", "press2": "0", "runtime": "13200",
                #                              "start_time": "2024-04-25 14:10:00", "last_backwash": "2024-04-25 05:55:00",
                #                              "maintenance": "0"},
                #                      "341": {"name": "FILTER BED 06", "status": "Backwash", "rof": "0",
                #                              "loh": "0", "press1": "2.8", "press2": "3.1", "runtime": "17800",
                #                              "start_time": "2024-04-25 17:55:00", "last_backwash": "2024-04-24 13:21:00",
                #                              "maintenance": "0"},
                #                      "342": {"name": "FILTER BED 07", "status": "Idle", "rof": "0",
                #                              "loh": "0", "press1": "0", "press2": "0", "runtime": "1500",
                #                              "start_time": "2024-04-25 18:50:00", "last_backwash": "2024-04-25 11:44:00",
                #                              "maintenance": "1"},
                #                      "343": {"name": "FILTER BED 08", "status": "Filtration", "rof": "512.6",
                #                              "loh": "1.1", "press1": "0", "press2": "0", "runtime": "4500",
                #                              "start_time": "2024-04-25 18:50:00", "last_backwash": "2024-04-25 11:44:00",
                #                              "maintenance": "0"},
                #                      "344": {"name": "FILTER BED 09", "status": "Filtration", "rof": "324.43",
                #                              "loh": "3.3", "press1": "0", "press2": "0", "runtime": "13200",
                #                              "start_time": "2024-04-25 14:10:00", "last_backwash": "2024-04-25 05:55:00",
                #                              "maintenance": "0"},
                #                      "345": {"name": "FILTER BED 10", "status": "Backwash", "rof": "0",
                #                              "loh": "0", "press1": "2.8", "press2": "3.1", "runtime": "17800",
                #                              "start_time": "2024-04-25 17:55:00", "last_backwash": "2024-04-24 13:21:00",
                #                              "maintenance": "0"},
                #                      "346": {"name": "FILTER BED 11", "status": "Idle", "rof": "0",
                #                              "loh": "0", "press1": "0", "press2": "0", "runtime": "1500",
                #                              "start_time": "2024-04-25 18:50:00", "last_backwash": "2024-04-25 11:44:00",
                #                              "maintenance": "0"},
                #                      "347": {"name": "FILTER BED 12", "status": "Filtration", "rof": "512.6",
                #                              "loh": "14.1", "press1": "0", "press2": "0", "runtime": "4500",
                #                              "start_time": "2024-04-25 18:50:00", "last_backwash": "2024-04-25 11:44:00",
                #                              "maintenance": "0"},
                #                      "348": {"name": "FILTER BED 13", "status": "Backwash", "rof": "0",
                #                              "loh": "0", "press1": "2.0", "press2": "4.10", "runtime": "13200",
                #                              "start_time": "2024-04-25 14:10:00", "last_backwash": "2024-04-25 05:55:00",
                #                              "maintenance": "0"},
                #                      "349": {"name": "FILTER BED 14", "status": "Filtration", "rof": "210.2",
                #                              "loh": "10.1", "press1": "0", "press2": "0", "runtime": "32800",
                #                              "start_time": "2024-04-25 17:55:00", "last_backwash": "2024-04-24 13:21:00",
                #                              "maintenance": "0"},
                #                      "350": {"name": "FILTER BED 15", "status": "Filtration", "rof": "30.3",
                #                              "loh": "3.4", "press1": "0", "press2": "0", "runtime": "1500",
                #                              "start_time": "2024-04-25 18:50:00", "last_backwash": "2024-04-25 11:44:00",
                #                              "maintenance": "0"},
                #                      "351": {"name": "FILTER BED 16", "status": "Filtration", "rof": "512.6",
                #                              "loh": "14.2", "press1": "0", "press2": "0", "runtime": "4500",
                #                              "start_time": "2024-04-25 18:50:00", "last_backwash": "2024-04-25 11:44:00",
                #                              "maintenance": "0"},
                #                      }
                caption = "DJB Treatment plant"
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {"type": "update",
                     "data": transmitters_data,
                     "caption": caption
                     }
                )
            except Exception as e:
                print(e)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {"type": "noInternet"}
                )

    async def update(self, event):
        await self.send(text_data=json.dumps({"data": event["data"],
                                              "type": event["type"],
                                              "caption": event["caption"]
                                              }))

    async def noInternet(self, event):
        await self.send(text_data=json.dumps({"type": event["type"]}))

    async def error(self, event):
        await self.send(text_data=json.dumps({"type": event["type"]}))