def get_database(log=False):

    if log:

        print("\n\033[93mThe mongo database:\033[0m\n\n{}\n".format(str(database)))

    else:

        return database

def drop_database(log=False):

    if log:

        print("\n\033[91mWarning! Are you sure you want to drop the database?\033[0m\n")

        while True:

            reply = str(input("\033[93my or n:\033[0m ")).lower()

            if reply == "y":

                client.drop_database(database)
                print("\n\033[93mOkay, the database has been droped!\033[0m\n")
                break

            elif reply == "n":

                print()
                break

    else:

        return client.drop_database(database)
